import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import Stage1 from './Stage1'
import Stage2 from './Stage2'
import Stage3 from './Stage3'
import Stage4 from './Stage4';

import './PGUpdateProperty.css'

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
  const stringWithoutCommas = stringWithCommas.replace(/,/g, '');
  return stringWithoutCommas;
}

const PGUpdateProperty = () => {
  const { propertyid } = useParams();
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties",
    propertyid
  );
  const [propertyObj, setPropertyObj] = useState(null)
  const [stageFlag, setStageFlag] = useState('stage1')

  // console.log("Property Object: ", propertyObj)

  // expand more expand less start
  const [expanded, setExpanded] = useState(true);

  const handleExpand = () => {
    setExpanded(!expanded);
  };
  // sexpand more expand less end

  // prop summary click start
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (window.innerWidth > 575) {
      navigate(`/propertydetails/${propertyid}`);
    } else {
      e.preventDefault();
    }
  };
  // prop summary click start

  return (
    <div className='top_header_pg pg_bg pg_update_property'>
      <div className="page_spacing">
        <div className="row row_reverse_991">
          <div className="col-lg-6">
            <div className="title_card mobile_full_575 mobile_gap">
              <h2 className="text-center">3-Steps Property Update</h2>
              <div className="vg12"></div>
              <div className="multi_steps">
                <div className="progress_bar">
                  <div className="fill" style={{ width: stageFlag === 'stage1' ? "33.33%" : stageFlag === 'stage2' ? "66.66%" : "100%" }}></div>
                </div>
                <div className="step_single fill">
                  <div className="number">
                    1
                  </div>
                  <h6>
                    Basic
                  </h6>
                </div>
                <div className={`step_single ${stageFlag === 'stage1' ? "wait" : "fill"}`}>
                  <div className="number">
                    2
                  </div>
                  <h6>
                    Detail
                  </h6>
                </div>
                <div className={`step_single ${stageFlag === 'stage3' ? "fill" : "wait"}`}>
                  <div className="number">
                    3
                  </div>
                  <h6>
                    More
                  </h6>
                </div>
                {/* <div className={stageFlag === 'stage4' ? "step_single " : "step_single wait"}>
                <div className="number">
                  4
                </div>
                <h6>
                  Image
                </h6>
              </div> */}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            {propertydoc &&
              <div className="title_card short_prop_summary relative pointer" onClick={handleClick}>
                {expanded && (
                  <div className="top on_mobile_575">
                    <div className="d-flex align-items-center" style={{
                      gap: "5px"
                    }} >
                      <h6 style={{
                        fontSize: "14px",
                        fontWeight: "400"
                      }}>{propertydoc.unitNumber} | {propertydoc.society} </h6>
                    </div>
                  </div>
                )}
                <div className="on_desktop_hide_575">
                  <div className="left">
                    <div className="img">
                      {propertydoc.images.length > 0 ? <img src={propertydoc.images[0]} alt={propertydoc.bhk} />
                        : <img src="/assets/img/admin_banner.jpg" alt="" />}
                    </div>
                    <div className="detail">
                      <div>
                        <span className="card_badge">
                          {propertydoc.pid}
                        </span>
                        {" "}{" "}
                        <span className={`card_badge ${propertydoc.isActiveInactiveReview.toLowerCase()}`}>
                          {propertydoc.isActiveInactiveReview}
                        </span>
                      </div>
                      <h6 className="demand">
                        <span>₹</span>
                        {(propertydoc.flag.toLowerCase() === "pms only" || propertydoc.flag.toLowerCase() === "pms after rent" || propertydoc.flag.toLowerCase() === "available for rent" || propertydoc.flag.toLowerCase() === "rented out") ? propertydoc.demandPriceRent && formatNumberWithCommas(propertydoc.demandPriceRent) : (propertydoc.flag.toLowerCase() === "rent and sale" || propertydoc.flag.toLowerCase() === "rented but sale") ? propertydoc.demandPriceRent && formatNumberWithCommas(propertydoc.demandPriceRent) + " / ₹" + propertydoc.demandPriceSale && formatNumberWithCommas(propertydoc.demandPriceSale) : propertydoc.demandPriceSale && formatNumberWithCommas(propertydoc.demandPriceSale)}

                        {propertydoc.maintenancecharges !== '' && <span
                          style={{
                            fontSize: "10px",
                          }}
                        >
                          + ₹{propertydoc.maintenancecharges} ({propertydoc.maintenancechargesfrequency})
                        </span>}
                      </h6>
                      <h6>{propertydoc.unitNumber} | {propertydoc.society} </h6>
                      <h6>{propertydoc.bhk} | {propertydoc.propertyType} {propertydoc.furnishing === "" ? "" : " | " + propertydoc.furnishing + "Furnished"}  </h6>
                      <h6>{propertydoc.locality}, {propertydoc.city} | {propertydoc.state}</h6>
                    </div>
                  </div>
                </div>
                <div className="on_mobile_575">
                  {!expanded && (
                    <div className="left">
                      <div className="img w-100 d-flex align-items-center">
                        {propertydoc.images.length > 0 ? <img src={propertydoc.images[0]} alt={propertydoc.bhk} />
                          : <img src="/assets/img/admin_banner.jpg" alt="" />}
                        <Link to={(`/propertydetails/${propertyid}`)} className='text_green text-center' style={{
                          flexGrow: "1"
                        }}>
                          View Detail
                        </Link>
                      </div>
                      <div className="detail">
                        <div>
                          <span className="card_badge">
                            {propertydoc.pid}
                          </span>
                          {" "}{" "}
                          <span className="card_badge">
                            {propertydoc.isActiveInactiveReview}
                          </span>
                        </div>
                        <h6 className="demand">
                        <span>₹</span>
                        {(propertydoc.flag.toLowerCase() === "pms only" || propertydoc.flag.toLowerCase() === "pms after rent" || propertydoc.flag.toLowerCase() === "available for rent" || propertydoc.flag.toLowerCase() === "rented out") ? propertydoc.demandPriceRent && formatNumberWithCommas(propertydoc.demandPriceRent) : (propertydoc.flag.toLowerCase() === "rent and sale" || propertydoc.flag.toLowerCase() === "rented but sale") ? propertydoc.demandPriceRent && formatNumberWithCommas(propertydoc.demandPriceRent) + " / ₹" + propertydoc.demandPriceSale && formatNumberWithCommas(propertydoc.demandPriceSale) : propertydoc.demandPriceSale && formatNumberWithCommas(propertydoc.demandPriceSale)}

                        {propertydoc.maintenancecharges !== '' && <span
                          style={{
                            fontSize: "10px",
                          }}
                        >
                          + ₹{propertydoc.maintenancecharges} ({propertydoc.maintenancechargesfrequency})
                        </span>}
                      </h6>                   
                        <h6>{propertydoc.unitNumber} | {propertydoc.society} </h6>
                        <h6>{propertydoc.bhk} | {propertydoc.propertyType} {propertydoc.furnishing === "" ? "" : " | " + propertydoc.furnishing + "Furnished"}  </h6>
                        <h6>{propertydoc.locality}, {propertydoc.city} | {propertydoc.state}</h6>


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
            }
          </div>

        </div>
        <div className="vg12"></div>
        <div className="vg22"></div>
        {stageFlag === 'stage1' && <Stage1 setPropertyObj={setPropertyObj} setStateFlag={setStageFlag}></Stage1>}
        {stageFlag === 'stage2' && <Stage2 propertyObj={propertyObj} setPropertyObj={setPropertyObj} setStateFlag={setStageFlag}></Stage2>}
        {stageFlag === 'stage3' && <Stage3 propertyObj={propertyObj} setPropertyObj={setPropertyObj} setStateFlag={setStageFlag}></Stage3>}
        {/* {stageFlag === 'stage4' && <Stage4 propertyObj={propertyObj} setPropertyObj={setPropertyObj} setStateFlag={setStageFlag}></Stage4>} */}
      </div>
    </div>
  )
}

export default PGUpdateProperty
