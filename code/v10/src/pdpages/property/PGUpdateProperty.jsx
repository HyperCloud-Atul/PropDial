import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import Stage1 from './Stage1'
import Stage2 from './Stage2'
import Stage3 from './Stage3'
import Stage4 from './Stage4';

import './PGUpdateProperty.css'

const PGUpdateProperty = () => {
  const { propertyid } = useParams();
  const [propertyObj, setPropertyObj] = useState(null)
  const [stageFlag, setStageFlag] = useState('stage1')
  return (
    <div className='top_header_pg pg_bg'>
      <div className="page_spacing">
        <div className="row">
          <div className="col-md-4">
            <div className="pg_header">
              <h2 className="m22 mb-1">Update Property</h2>
              <h4 className="r18 light_black">You can update the property here</h4>
            </div>
          </div>
          <div className="col-md-8">
            <div className="multi_steps">
              <div className="progress_bar">
                <div className="fill" style={{
                  width: "25%"
                }}></div>
              </div>
              <div className="step_single ">
                <div className="number">
                  1
                </div>
                <h6>
                  Basic
                </h6>
              </div>
              <div className="step_single wait">
                <div className="number">
                  2
                </div>
                <h6>
                  Detail
                </h6>
              </div>
              <div className="step_single wait">
                <div className="number">
                  3
                </div>
                <h6>
                  More
                </h6>
              </div>
              <div className="step_single wait">
                <div className="number">
                  4
                </div>
                <h6>
                  Image
                </h6>
              </div>
            </div>
          </div>  
        </div>


        <div className="vg22"></div>
        <div className="vg22"></div>
        {stageFlag === 'stage1' && <Stage1 setPropertyObj={setPropertyObj} setStateFlag={setStageFlag}></Stage1>}
        {stageFlag === 'stage2' && <Stage2 propertyObj={propertyObj} setPropertyObj={setPropertyObj} setStateFlag={setStageFlag}></Stage2>}
        {stageFlag === 'stage3' && <Stage3 propertyObj={propertyObj} setPropertyObj={setPropertyObj} setStateFlag={setStageFlag}></Stage3>}
        {stageFlag === 'stage4' && <Stage4 propertyObj={propertyObj} setPropertyObj={setPropertyObj} setStateFlag={setStageFlag}></Stage4>}
      </div>
    </div>
  )
}

export default PGUpdateProperty
