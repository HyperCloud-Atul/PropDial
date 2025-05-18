import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Select from "react-select";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

import { projectFirestore } from "../../../../firebase/config";
import { useCollection } from "../../../../hooks/useCollection";
// import useInView from "../../../../hooks/useInView";

// import component
import AgentSingle from "./AgentSingle";
import AgentTable from "./AgentTable";
import Filters from "../../../../components/Filters";

import "./PGAgent.scss";

const itemsPerPage = 100; // Number of items per page

const statusFilter = ["Active", "Banned"];

const ViewAgent = () => {
  const navigate = useNavigate();

  // let stateOptions = useRef([]);
  const debouncer = useRef(null);
  const loadingRef = useRef(null);

  // const isIntersecting = useInView(loadingRef, {
  //   threshold: 0.5,
  //   rootMargin: "300px",
  // });

  const { documents: masterState, error: masterStateError } = useCollection(
    "m_states",
    "",
    ["state", "asc"]
  );

  // Search input state
  const [state, setState] = useState({
    label: "Delhi",
    value: "_delhi",
  });
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("active"); // Default to 'active'
  
  // const lastVisibleDocRef = useRef(null);
  // const [page, setPage] = useState(1); // Current page
  // const [hasMore, setHasMore] = useState(true); // Whether there's more data to load
  // const [firstLoad, setFirstLoad] = useState(true);

  const changeStatusFilter = (newStatus) => {
    setStatus(newStatus);
    setFilteredData([]);
    setAllData([]);
  };
  const stateOptions = useMemo(() => {
    if (!masterState) return [];
    return masterState.map((data) => ({
      label: data.state,
      value: data.id,
    }));
  }, [masterState]);

  // console.log(stateOptions);
  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  //update state

  const fetchAgents = useCallback(async () => {
    // if (isLoading) return;
    setIsLoading(true);
    console.log("status: ", status);
    console.log("state: ", state.label);
    try {
      let ref = await projectFirestore
        .collection("agent-propdial")
        .where("state", "==", state.label)
        .where("status", "==", status.toLowerCase())
        .orderBy("agentName", "asc");

      const snapshot = await ref.get();

      if (!snapshot.empty) {
        const _filterList = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setFilteredData(_filterList);
        setAllData(_filterList);
      } else {
        setFilteredData([]);
        setAllData([]);
      }
    } catch (error) {
      console.error("Error fetching filtered data: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [state.label, status]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  //fetch more data

  //search function

  const handleSearchInputChange = async (e) => {
    const value = e.target.value || "";
    setSearchInput(value);
    if (debouncer.current) {
      clearTimeout(debouncer.current);
    }
    if (value.trim() === "") {
      setFilteredData(allData);
      return;
    }
    const _searchkey = toTitleCase(value).trim();

    setIsLoading(true);

    debouncer.current = setTimeout(async () => {
      console.log("_searchkey: ", _searchkey);
      try {
        const nameQuery = projectFirestore
          .collection("agent-propdial")
          .where("state", "==", state.label)
          .where("status", "==", status.toLowerCase())
          .where("agentName", ">=", _searchkey)
          .where("agentName", "<=", _searchkey + "\uf8ff")
          .orderBy("agentName");

        const cityQuery = projectFirestore
          .collection("agent-propdial")
          .where("state", "==", state.label)
          .where("status", "==", status.toLowerCase())
          .where("city", ">=", _searchkey)
          .where("city", "<=", _searchkey + "\uf8ff")
          .orderBy("city");

        const [nameSnap, citySnap] = await Promise.all([
          nameQuery.get(),
          cityQuery.get(),
        ]);

        const allDocs = [...nameSnap.docs, ...citySnap.docs];
        if (allDocs.length !== 0) {
          const _filterList = allDocs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          console.log(_filterList);
          setFilteredData(_filterList);
        } else {
          setFilteredData([]);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 500);
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
            onChange={(e) => {
              setState(e);
              setFilteredData([]);
              setAllData([]);
              // filteredAgentList(e);
            }}
            options={stateOptions}
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
          <div className="new_inline">
            <Filters
              changeFilter={changeStatusFilter}
              filterList={statusFilter}
            />
          </div>
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
            {isLoading && (
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
