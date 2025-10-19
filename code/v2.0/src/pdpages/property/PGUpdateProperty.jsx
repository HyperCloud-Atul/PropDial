import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import Stage1 from "./Stage1";
import Stage2 from "./Stage2";
import Stage3 from "./Stage3";
import Stage4 from "./Stage4";
import PropertySummaryCard from "./PropertySummaryCard";
import InactiveUserCard from "../../components/InactiveUserCard";
import { ClipLoader } from "react-spinners";

import "./PGUpdateProperty.css";

const PGUpdateProperty = () => {
  const { user } = useAuthContext();
  const { propertyid } = useParams();
  const { document: propertydoc, error: propertyerror } = useDocument(
    "properties-propdial",
    propertyid
  );
  const [propertyObj, setPropertyObj] = useState(null);
  const [stageFlag, setStageFlag] = useState("stage1");

  // console.log("Property Object: ", propertyObj)

  return (
    <>
      {user && user.status === "active" ? (
        <div className="top_header_pg pg_bg pg_update_property">
          <div className="page_spacing">
            {propertydoc?.category ? (
  <>
  <div
    className={`top_right_badge ${
      propertydoc &&
      propertydoc.isActiveInactiveReview.toLowerCase()
    }`}
  >
    {propertydoc && propertydoc.category}
  </div>
  <div className="row row_reverse_991">
    <div className="col-lg-6">
      <div className="title_card mobile_full_575 mobile_gap">
        <h2 className="text-center">3-Steps Property Update</h2>
        <div className="vg12"></div>
        <div className="multi_steps">
          <div className="progress_bar">
            <div
              className="fill"
              style={{
                width:
                  stageFlag === "stage1"
                    ? "33.33%"
                    : stageFlag === "stage2"
                    ? "66.66%"
                    : "100%",
              }}
            ></div>
          </div>
          <div className="step_single fill">
            <div className="number">1</div>
            <h6>Basic</h6>
          </div>
          <div
            className={`step_single ${
              stageFlag === "stage1" ? "wait" : "fill"
            }`}
          >
            <div className="number">2</div>
            <h6>Detail</h6>
          </div>
          <div
            className={`step_single ${
              stageFlag === "stage3" ? "fill" : "wait"
            }`}
          >
            <div className="number">3</div>
            <h6>More</h6>
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
    <PropertySummaryCard
      propertydoc={propertydoc}
      propertyId={propertyid}
    />
  </div>
  <div className="vg12"></div>
  <div className="vg22"></div>
  {stageFlag === "stage1" && (
    <Stage1
      setPropertyObj={setPropertyObj}
      setStateFlag={setStageFlag}
    ></Stage1>
  )}
  {stageFlag === "stage2" && (
    <Stage2
      propertyObj={propertyObj}
      setPropertyObj={setPropertyObj}
      setStateFlag={setStageFlag}
    ></Stage2>
  )}
  {stageFlag === "stage3" && (
    <Stage3
      propertyObj={propertyObj}
      setPropertyObj={setPropertyObj}
      setStateFlag={setStageFlag}
    ></Stage3>
  )}
  {/* {stageFlag === 'stage4' && <Stage4 propertyObj={propertyObj} setPropertyObj={setPropertyObj} setStateFlag={setStageFlag}></Stage4>} */}
</>
            )
          :
          (
            <div className="page_loader">
            <ClipLoader color="var(--theme-green2)" loading={true} />
          </div>
          )
          }
          
       
          </div>
        </div>
      ) : (
        <InactiveUserCard />
      )}
    </>
  );
};

export default PGUpdateProperty;
