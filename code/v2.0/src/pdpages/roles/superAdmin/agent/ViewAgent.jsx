import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Select from "react-select";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

import { projectFirestore } from "../../../../firebase/config";
import { useCollection } from "../../../../hooks/useCollection";

import AgentSingle from "./AgentSingle";
import AgentTable from "./AgentTable";
import Filters from "../../../../components/Filters";
import client from "../../../../firebase/algoliaConfig";

import "./PGAgent.scss";

const statusFilter = ["Active", "Banned"];

const ViewAgent = () => {
  const navigate = useNavigate();
  const debouncer = useRef(null);

  const { documents: masterState } = useCollection("m_states", "", [
    "state",
    "asc",
  ]);

  const [state, setState] = useState({
    label: "Karnataka",
    value: "_karnataka",
  });
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("active");

  const fetchAgents = useCallback(async () => {
    setIsLoading(true);
    try {
      const ref = projectFirestore
        .collection("agent-propdial")
        .where("state", "==", state.label)
        .where("status", "==", status.toLowerCase())
        .orderBy("agentName", "asc");

      const snapshot = await ref.get();

      if (!snapshot.empty) {
        const docs = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAllData(docs);
      } else {
        setAllData([]);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setIsLoading(false);
    }
  }, [state.label, status]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (debouncer.current) clearTimeout(debouncer.current);

    debouncer.current = setTimeout(async () => {
      const searchValue = value.trim();
      if (!searchValue) {
        setSearchResults([]);
        fetchAgents();
        return;
      }

      const { results } = await client.search({
        requests: [
          {
            indexName: "agent-propdial",
            query: searchValue,
            filters: `state:"${state.label}"`,
            attributesToHighlight: ["agentName", "agentPhone", "city"],
          },
        ],
      });
      console.log("result:", results);

      setSearchResults(results[0].hits);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (debouncer.current) clearTimeout(debouncer.current);
    };
  }, []);
  console.log({ searchResults });
  /** 🔄 View Mode */
  const [viewMode, setViewMode] = useState("card_view");

  return (
    <>
      {/* Header */}
      <div className="pg_header d-flex justify-content-between">
        <div className="left">
          <h2 className="m22">
            Agents in <span className="text_orange">{state.label}</span> —{" "}
            {isLoading ? "Loading..." : allData.length}
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

      <div className="vg12" />

      {/* Filters */}
      <div className="filters">
        <div className="left">
          <div className="rt_global_search search_field">
            <input
              placeholder="Search by name or city"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
            <div className="field_icon">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>

          <Select
            className="state_filter"
            onChange={(e) => setState(e)}
            options={masterState?.map((data) => ({
              label: data.state,
              value: data.id,
            }))}
            value={state}
            styles={{
              control: (base) => ({
                ...base,
                outline: "none",
                background: "#eee",
                borderBottom: "1px solid var(--theme-blue)",
              }),
            }}
          />
        </div>

        <div className="right">
          <div className="new_inline">
            <Filters changeFilter={setStatus} filterList={statusFilter} />
          </div>
          <div className="button_filter diff_views">
            <div
              className={`bf_single ${
                viewMode === "card_view" ? "active" : ""
              }`}
              onClick={() => setViewMode("card_view")}
            >
              <span className="material-symbols-outlined">
                calendar_view_month
              </span>
            </div>
            <div
              className={`bf_single ${
                viewMode === "table_view" ? "active" : ""
              }`}
              onClick={() => setViewMode("table_view")}
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

      <hr />

      {/* Empty State */}
      {allData.length === 0 && !isLoading && (
        <div className="pg_msg">No agents found in {state.label}.</div>
      )}

      {/* Agent Data */}
      <div>
        {viewMode === "card_view" && (
          <>
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((result) => (
                  <div key={result.objectID} className="search-result-item">
                    <h3
                     
                      dangerouslySetInnerHTML={{
                        __html:
                          result._highlightResult?.agentName?.value ||
                          result.agentName,
                      }}
                    ></h3>
                    <p className="phone">{result.agentPhone}</p>
                    <p
                      className="highlighted-text"
                      dangerouslySetInnerHTML={{
                        __html:
                          result._highlightResult?.city?.value || result.city,
                      }}
                    ></p>
                    <small>{result.state}</small>
                  </div>
                ))}
              </div>
            )}
            <AgentSingle agentDoc={allData} />
            {isLoading && (
              <div className="filter_loading">
                <BeatLoader color="var(--theme-green)" />
              </div>
            )}
          </>
        )}

        {viewMode === "table_view" && <AgentTable agentDoc={allData} />}
      </div>
    </>
  );
};

export default ViewAgent;
