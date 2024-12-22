import React from "react";
import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { projectFirestore } from "../../../../firebase/config";
import { useCollection } from "../../../../hooks/useCollection";

// import component
import AgentSingle from "./AgentSingle";
import AgentTable from "./AgentTable";
import { BeatLoader } from "react-spinners";

const ViewAgent = ({ agentDoc, handleShowAIForm }) => {
  const [state, setState] = useState({
    label: "Delhi",
    value: "_delhi",
  });
  let cityOptions = useRef([]);
  let stateOptions = useRef([]);

  const { documents: masterState, error: masterStateError } = useCollection(
    "m_states",
    "",
    ["state", "asc"]
  );

  // Search input state
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState(agentDoc);
  const [allData, setAllData] = useState(agentDoc);
  const [page, setPage] = useState(1); // Current page
const [hasMore, setHasMore] = useState(true); // Whether there's more data to load
const itemsPerPage = 100; // Number of items per page

  stateOptions.current =
    masterState &&
    masterState.map((data) => ({
      label: data.state,
      value: data.id,
    }));

  const handleSearchInputChange = (e) => {
    console.log(e.target.value);

    setSearchInput(e.target.value);
    let _searchkey = e.target.value && e.target.value.toLowerCase();
    console.log(_searchkey, filteredData);

    let _filterList = [];
    _filterList = allData.filter((element) =>
      element.searchKey.includes(_searchkey)
    );
    console.log("_filterList", _filterList);
    setFilteredData(_filterList);
  };

  // old filteragent code with no loader while change state 
  // don't delete 
  // const filteredAgentList = async (data) => {
  //   setIsLoading(true);
  //   console.log("filteredDataNew data: ", data);
  //   // console.log("agentDoc : ", agentDoc)
  //   let _filterList = [];
  //   setSearchInput("");
    
  //   const ref = await projectFirestore
  //     .collection("agent-propdial")
  //     .where("state", "==", data.label);
  //   // .orderBy("state", "asc");

  //   console.log("ref: ", ref);

  //   ref.onSnapshot(async (snapshot) => {
  //     console.log(snapshot.docs);
  //     if (snapshot.docs) {
  //       console.log("snapshot.docs: ", snapshot.docs);
  //       _filterList = snapshot.docs.map((agentData) => ({
  //         agentCompnayName: agentData.data().agentCompnayName,
  //         agentEmail: agentData.data().agentEmail,
  //         agentName: agentData.data().agentName,
  //         agentPhone: agentData.data().agentPhone,
  //         city: agentData.data().city,
  //         id: agentData.id,
  //         state: agentData.data().state,
  //         createdAt: agentData.data().createdAt,
  //         createdBy: agentData.data().createdBy,
  //         searchKey:
  //           agentData.data().agentName.toLowerCase() +
  //           agentData.data().city.toLowerCase() +
  //           agentData.id.toLowerCase(),
  //       }));
  //     }
  //     console.log(_filterList);
  //     setFilteredData(_filterList);
  //     setAllData(_filterList);
  //   });
  //   setIsLoading(false);
  // };
  const filteredAgentList = (data) => {
    setIsLoading(true); // Set loading to true when fetching begins
  
    const ref = projectFirestore
      .collection("agent-propdial")
      .where("state", "==", data.label);
  
    ref.get().then((snapshot) => {
      const _filterList = snapshot.docs.map((agentData) => ({
        agentCompnayName: agentData.data().agentCompnayName,
        agentEmail: agentData.data().agentEmail,
        agentName: agentData.data().agentName,
        agentPhone: agentData.data().agentPhone,
        city: agentData.data().city,
        id: agentData.id,
        state: agentData.data().state,
        createdAt: agentData.data().createdAt,
        createdBy: agentData.data().createdBy,
        searchKey:
          agentData.data().agentName.toLowerCase() +
          agentData.data().city.toLowerCase() +
          agentData.id.toLowerCase(),
      }));
      setFilteredData(_filterList);
      setAllData(_filterList);
      setIsLoading(false); // Set loading to false once data is fetched
    }).catch((error) => {
      console.error("Error fetching filtered data: ", error);
      setIsLoading(false); // Ensure loading is false even if there's an error
    });
  };
  

  // View mode start
  const [viewMode, setviewMode] = useState("card_view"); // Initial mode is grid with 3 columns
  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };
  // View mode end
  return (
    <>
      {/* view agent pg header and filters start  */}
      <div className="pg_header d-flex justify-content-between">
        <div className="left">
          <h2 className="m22">
            Total Agent:{" "}
            {/* {agentDoc && <span className="text_orange">{agentDoc.length}</span>} */}
            {filteredData && (
              <span className="text_orange">
                {isLoading ? "" : filteredData.length}
               
              </span>
            )}           
          </h2>
        </div>
        <div className="right">
          <img
            src="./assets/img/icons/excel_logo.png"
            alt=""
            className="excel_dowanload"
          />
        </div>
      </div>
      <div className="vg12"></div>
      <div className="filters">
        <div className="left">
          <div className="rt_global_search search_field">
            <input
              placeholder="Search"
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e)}
            />
            <div className="field_icon">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
          <Select
            className="state_filter"
            // onChange={(option) => setState(option)}
            onChange={(e) => {
              setState(e);
              filteredAgentList(e);
            }}
            options={stateOptions.current}
            value={state}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                outline: "none",
                background: "#eee",
                borderBottom: " 1px solid var(--theme-blue)",
              }),
            }}
          />
        </div>

        <div className="right">
          <div className="button_filter diff_views">
            <div
              className={`bf_single ${
                viewMode === "card_view" ? "active" : ""
              }`}
              onClick={() => handleModeChange("card_view")}
            >
              <span className="material-symbols-outlined">
                calendar_view_month
              </span>
            </div>
            <div
              className={`bf_single ${
                viewMode === "table_view" ? "active" : ""
              }`}
              onClick={() => handleModeChange("table_view")}
            >
              <span className="material-symbols-outlined">view_list</span>
            </div>
          </div>
          <div
            onClick={handleShowAIForm}
            className="theme_btn no_icon header_btn btn_fill"
          >
            Add New
          </div>
        </div>
      </div>
      <hr></hr>
      {/* view agent pg header and filters end  */}

      {filteredData && filteredData.length <= 0 && (
        <div>No Agent Data Available</div>
      )}
      {/* agent card and table  */}
      {isLoading &&
       <div className="filter_loading">
        <BeatLoader color={"var(--theme-green)"} />
        </div>}
      {!isLoading && (
        <div>
          {viewMode === "card_view" && filteredData && (
            <AgentSingle agentDoc={filteredData} />
          )}
          {viewMode === "table_view" && (
            // <h5 className="text-center text_green">Coming Soon....</h5>
            <AgentTable agentDoc={filteredData} />
          )}
        </div>
      )}
    </>
  );
};

export default ViewAgent;
