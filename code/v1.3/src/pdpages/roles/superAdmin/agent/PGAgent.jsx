import React from "react";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { useState, useEffect } from "react";
import { useCollection } from "../../../../hooks/useCollection";
import { Link } from "react-router-dom";

// component
import ScrollToTop from "../../../../components/ScrollToTop";
import InactiveUserCard from "../../../../components/InactiveUserCard";
import NineDots from "../../../../components/NineDots";
import AddAgent from "./AddAgent";
import ViewAgent from "./ViewAgent";
import {
  BarLoader,
  BeatLoader,
  BounceLoader,
  CircleLoader,
  ClimbingBoxLoader,
  ClipLoader,
  ClockLoader,
  DotLoader,
  FadeLoader,
  GridLoader,
  HashLoader,
  MoonLoader,
  PacmanLoader,
  PropagateLoader,
  PuffLoader,
  PulseLoader,
  RingLoader,
  RiseLoader,
  RotateLoader,
  ScaleLoader,
  SyncLoader
} from "react-spinners";

// import scss 
import './PGAgent.scss'

const PGAgent = () => {
  const { user } = useAuthContext();
  const [showAIForm, setShowAIForm] = useState(false);
  const [allList, setAllList] = useState([]);
  const handleShowAIForm = () => setShowAIForm(!showAIForm);

  // get agent document start
  // const { documents: agentDoc, errors: agentDocError } =
  //   useCollection("agent-propdial", "", ["createdAt", "desc"]);
  const { documents: agentDoc, errors: agentDocError } = useCollection("agent-propdial", ["state", "==", "Delhi"], ["createdAt", "desc"]);

  // get agent document end
  useEffect(() => {

    let _list = [];
    agentDoc && agentDoc.forEach(element => {
      _list.push({
        ...element,
        searchKey: element.agentName.toLowerCase() + element.city.toLowerCase() + element.id.toLowerCase()
      })

    });
    setAllList(_list)

  }, [agentDoc])


  // nine dots menu start
  const nineDotsMenu = [
    { title: "User List", link: "/userlist", icon: "group" },
  ];


  // nine dots menu end
  return (
    <div>
      <ScrollToTop />
      {user && user.status === "active" ? (
        <div className="top_header_pg pg_bg pg_agent">
          <div className="page_spacing pg_min_height">
            {/* nine dot menu and plus icons start  */}
            <NineDots nineDotsMenu={nineDotsMenu} />
            <Link className="property-list-add-property with_9dot">
              <span
                className="material-symbols-outlined"
                onClick={handleShowAIForm}
              >
                {showAIForm ? "close" : "add"}
              </span>
            </Link>
            {/* nine dot menu and plus icons start  */}

            {/* if no agent doc available start */}
            {allList && allList.length === 0 && (
              <div className={`pg_msg ${showAIForm && "d-none"}`}>
                <div>
                  {/* No Agent Yet! */}
                  <BeatLoader color={"var(--theme-green)"} />
                  {/* <div
                    onClick={handleShowAIForm}
                    className={`theme_btn no_icon header_btn mt-3 ${showAIForm ? "btn_border" : "btn_fill"
                      }`}
                  >
                    {showAIForm ? "Cancel" : "Add New"}
                  </div> */}
                </div>
              </div>
            )}
            {/* if no agent doc available end  */}

            {/* view agent start  */}
            {allList && allList.length !== 0 && (
              <>
                {!showAIForm && (
                  <ViewAgent
                    agentDoc={allList}
                    handleShowAIForm={handleShowAIForm}
                  />
                )}
              </>
            )}
            {/* view agent end  */}

            {/* add agent start  */}
            {showAIForm && (
              <>
                <div className="pg_header d-flex justify-content-between">
                  <div
                    className="left d-flex align-items-center pointer"
                    style={{
                      gap: "5px",
                    }}
                  >
                    <span
                      className="material-symbols-outlined pointer"
                      onClick={handleShowAIForm}
                    >
                      arrow_back
                    </span>
                    <h2 className="m22">Add Agent</h2>
                  </div>
                </div>
                <hr />
                <div className="vg12"></div>
                <AddAgent
                  showAIForm={showAIForm}
                  setShowAIForm={setShowAIForm}
                  handleShowAIForm={handleShowAIForm}
                  agentID={'new'}
                />
              </>
            )}
            {/* add agent end     */}
          </div>
        </div>
      ) : (
        <InactiveUserCard />
      )}
    </div>
  );
};

export default PGAgent;
