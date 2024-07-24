import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import Stage1 from './Stage1'
import Stage2 from './Stage2'
import Stage3 from './Stage3'
import Stage4 from './Stage4';

import './PGUpdateProperty.css'

const PGUpdateProperty = () => {
  const { propertyid } = useParams();
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties",
    propertyid
  );
  const [propertyObj, setPropertyObj] = useState(null)
  const [stageFlag, setStageFlag] = useState('stage1')

  console.log("Property Object: ", propertyObj)

  return (
    <div className='top_header_pg pg_bg'>
      <div className="page_spacing">
        <div className="row">
        <div className="col-md-6">
            {propertydoc &&
             
               
                <div className="my_big_card short_prop_summary">
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
                        <span className="card_badge">
                          {propertydoc.isActiveInactiveReview}
                        </span>
                      </div>
                      <h6 className="demand">
                        <span>₹</span> {propertydoc.demandPrice}
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
                  <div className="right">

                  </div>
                  <div className="full_address">



                  </div>
                </div>
              }
          </div>
          <div className="col-md-6">        
              <h2 className="m22 text-center text_orange">3-Steps Property Update</h2>
           
            
            <div className="vg22"></div>
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
