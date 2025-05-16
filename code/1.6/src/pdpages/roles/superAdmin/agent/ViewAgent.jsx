import React, { useMemo } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Select from "react-select";
import { projectFirestore } from "../../../../firebase/config";
import { useCollection } from "../../../../hooks/useCollection";
import useInView from "../../../../hooks/useInView";

// import component
import AgentSingle from "./AgentSingle";
import AgentTable from "./AgentTable";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

import "./PGAgent.scss";
const itemsPerPage = 100; // Number of items per page

const ViewAgent = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    label: "Delhi",
    value: "_delhi",
  });
  let cityOptions = useRef([]);
  let stateOptions = useRef([]);
  const debouncer = useRef(null);
  const loadingRef = useRef(null);

  const isIntersecting = useInView(loadingRef, {
    threshold: 0.5,
    rootMargin: "300px",
  });

  const { documents: masterState, error: masterStateError } = useCollection(
    "m_states",
    "",
    ["state", "asc"]
  );

  // Search input state
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [page, setPage] = useState(1); // Current page
  const [hasMore, setHasMore] = useState(true); // Whether there's more data to load

  stateOptions.current =
    masterState &&
    masterState.map((data) => ({
      label: data.state,
      value: data.id,
    }));

  console.log(stateOptions);
  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  //update state

  useEffect(() => {
    setFilteredData([]);
    setAllData([]);
    setLastVisibleDoc(null);
    setHasMore(true);
    setSearchInput("");
  }, [state.label]);

  //fetch intial data
  const fetchAgents = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      let ref = await projectFirestore
        .collection("agent-propdial")
        .where("state", "==", state.label)
        .orderBy("agentName", "asc")
        .limit(itemsPerPage);

      if (lastVisibleDoc) {
        ref = ref.startAfter(lastVisibleDoc);
      }

      const snapshot = await ref.get();
      if (snapshot.empty) {
        setHasMore(false);
        return;
      }
      const _filterList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(_filterList);

      setLastVisibleDoc(snapshot.docs[snapshot.docs.length - 1]);

      if (snapshot.docs.length < itemsPerPage) {
        setHasMore(false);
      }
      setHasMore(true);
      setFilteredData((prev) => [...prev, ..._filterList]);
      setAllData((prev) => [...prev, ..._filterList]);
    } catch (error) {
      console.error("Error fetching filtered data: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [state.label, lastVisibleDoc, hasMore, isLoading]);

  //fetch more data

  useEffect(() => {
    if (isIntersecting && !searchInput) fetchAgents();
  }, [isIntersecting, fetchAgents, searchInput]);

  //search function

  const handleSearchInputChange = (e) => {
    const value = e.target.value || "";
    setSearchInput(value);

    const _searchkey = toTitleCase(value).trim();

    if (debouncer.current) {
      clearTimeout(debouncer.current);
    }

    if (!_searchkey) {
      setFilteredData(allData); // Restore full data if input cleared
      setIsLoading(false);
      return;
    }

    debouncer.current = setTimeout(async () => {
      setIsLoading(true); // Set loading inside debounce
      try {
        const ref = await projectFirestore
          .collection("agent-propdial")
          .where("state", "==", state.label)
          .orderBy("agentName")
          .startAt(_searchkey)
          .endAt(_searchkey + "\uf8ff");

        const snapshot = await ref.get();

        if (!snapshot.empty) {
          const data = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setFilteredData(data);
        } else {
          setFilteredData([]);
        }
        setHasMore(false);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  //clear the debouncer
  useEffect(() => {
    return () => {
      if (debouncer.current) {
        clearTimeout(debouncer.current);
      }
    };
  }, []);

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
  // const filteredAgentList = (data) => {
  //   setIsLoading(true); // Set loading to true when fetching begins
  //   setSearchInput("");

  //   projectFirestore
  //     .collection("agent-propdial")
  //     .where("state", "==", data.label)
  //     .get()
  //     .then((snapshot) => {
  //       const _filterList = snapshot.docs.map((agentData) => ({
  //         agentCompnayName: agentData.data().agentCompnayName,
  //         agentEmail: agentData.data().agentEmail,
  //         agentName: agentData.data().agentName,
  //         agentPhone: agentData.data().agentPhone,
  //         city: agentData.data().city,
  //         id: agentData.id,
  //         state: agentData.data().state,
  //         createdAt: agentData.data().createdAt,
  //         createdBy: agentData.data().createdBy,
  //         // searchKey:
  //         //   agentData.data().agentName.toLowerCase() +
  //         //   agentData.data().city.toLowerCase() +
  //         //   agentData.id.toLowerCase(),
  //       }));
  //       setFilteredData(_filterList);
  //       setAllData(_filterList);
  //       setIsLoading(false); // Set loading to false once data is fetched
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching filtered data: ", error);
  //       setIsLoading(false); // Ensure loading is false even if there's an error
  //     });
  // };

  // View mode start
  const [viewMode, setviewMode] = useState("card_view"); // Initial mode is grid with 3 columns
  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };

  // When state changes, reset data and fetch first page

  // if (isLoading) {
  //   return (
  //     <div className="filter_loading" style={{ height: "80vh" }}>
  //       <BeatLoader color="var(--theme-green)" />
  //     </div>
  //   );
  // }

  // View mode end
  return (
    <>
      {/* view agent pg header and filters start  */}
      <div className="pg_header d-flex justify-content-between">
        <div className="left">
          <h2 className="m22">
            Filtered Agent:{" "}
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
            src="/assets/img/icons/excel_logo.png"
            alt="propdial"
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
              // filteredAgentList(e);
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
            onClick={() => navigate("/agents/new")}
            className="theme_btn no_icon header_btn btn_fill"
          >
            Add New
          </div>
        </div>
      </div>
      <hr></hr>
      {/* view agent pg header and filters end  */}

      {filteredData && filteredData.length === 0 && !isLoading && (
        <div className="pg_msg">No agents in {state.label}.</div>
      )}
      {/* agent card and table  */}

      <div>
        {viewMode === "card_view" && filteredData && (
          <>
            <AgentSingle agentDoc={filteredData} />
            {(isLoading || hasMore) && (
              <div ref={loadingRef} className="filter_loading">
                <BeatLoader color={"var(--theme-green)"} />
              </div>
            )}
          </>
        )}
        {viewMode === "table_view" && (
          // <h5 className="text-center text_green">Coming Soon....</h5>
          <AgentTable agentDoc={filteredData} />
        )}
      </div>

      {/* { && <div style={{ height: "20px" }}>loading...</div>} */}
    </>
  );
};

export default ViewAgent;
