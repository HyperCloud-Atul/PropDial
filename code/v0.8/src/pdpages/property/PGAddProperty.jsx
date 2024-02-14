import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import Stage1 from '../../pages/create/Stage1'
import Stage2 from '../../pages/create/Stage2'
import Stage3 from '../../pages/create/Stage3'

const PGAddProperty = () => {
  const { propertyid } = useParams();
  const [propertyObj, setPropertyObj] = useState(null)
  const [stageFlag, setStageFlag] = useState('stage1')
  return (
    <div className='top_header_pg pg_bg'>
      <div className="page_spacing">
        <div className="pg_header">
          <h2 className="p_title">Add Property</h2>
          <h4 className="p_subtitle">You can add your property here</h4>
        </div>
        <div className="verticall_gap"></div>
        {stageFlag === 'stage1' && <Stage1 setPropertyObj={setPropertyObj} setStateFlag={setStageFlag}></Stage1>}
        {stageFlag === 'stage2' && <Stage2 propertyObj={propertyObj} setPropertyObj={setPropertyObj} setStateFlag={setStageFlag}></Stage2>}
        {stageFlag === 'stage3' && <Stage3 propertyObj={propertyObj} setPropertyObj={setPropertyObj} setStateFlag={setStageFlag}></Stage3>}
      </div>
    </div>
  )
}

export default PGAddProperty
