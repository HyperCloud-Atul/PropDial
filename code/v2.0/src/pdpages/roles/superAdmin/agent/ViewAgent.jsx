import { useState, useEffect, useRef, useCallback } from "react";
import Select from "react-select";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

import { projectFirestore } from "../../../../firebase/config";
import { useCollection } from "../../../../hooks/useCollection";

import AgentSingle from "./AgentSingle";
import AgentTable from "./AgentTable";
import Filters from "../../../../components/Filters";
import client from "../../../../firebase/algoliaConfig";
import useInView from "../../../../hooks/useInView";

import "./PGAgent.scss";

// const statusFilter = ["Active", "Banned"];
const PAGE_SIZE = 10;
const ViewAgent = () => {
  const navigate = useNavigate();
  const debouncer = useRef(null);
  const cacheRef = useRef([]);

  // --- STATE HANDLING ---
  const [masterState, setMasterState] = useState([]);
  const [state, setState] = useState(() => {
    const savedState = localStorage.getItem("state");
    return savedState
      ? JSON.parse(savedState)
      : { label: "Karnataka", value: "_karnataka" };
  });
  const [cityOptions, setCityOptions] = useState([]);
  const [city, setCity] = useState({
    label: "Select City",
    value: "_select_city",
  });

  useEffect(() => {
    if (state && state.value) {
      localStorage.setItem("state", JSON.stringify(state));
    }
  }, [state]);

  // --- FETCH STATES ---
  const fetchStates = async () => {
    try {
      const snapshot = await projectFirestore
        .collection("m_states")
        .orderBy("state", "asc")
        .get();

      const states = snapshot.docs.map((doc) => ({
        label: doc.data().state,
        value: doc.id,
      }));

      setMasterState(states);
      setCity({
        label: "Select City",
        value: "_select_city",
      });
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);
  // --- FETCH CITIES ---
  const fetchCities = async () => {
    if (!state?.label) return;
    try {
      const snapshot = await projectFirestore
        .collection("m_cities")
        .where("state", "==", state.value)
        .orderBy("city", "asc")
        .get();

      const cities = snapshot.docs.map((doc) => ({
        label: doc.data().city,
        value: doc.id,
      }));

      setCityOptions(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCityOptions([]);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [state]);

  // --- DATA + FETCH LOGIC ---
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [status, setStatus] = useState("active");

  const [setRef, isInView] = useInView({
    rootMargin: "1000px", // triggers early
    threshold: 0.1,
  });
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // --- FETCH AGENTS ---
  const fetchAgents = useCallback(
    async (reset = false, cursor = null) => {
      if (city.value === "_select_city") return;
      setIsLoading(true);

      try {
        let ref = projectFirestore
          .collection("agent-propdial")
          .where("state", "==", state.label)
          .where("city", "==", city.label)
          // .where("status", "==", status.toLowerCase())
          .orderBy("agentName", "asc")
          .limit(PAGE_SIZE);

        if (!reset && cursor) ref = ref.startAfter(cursor);

        const snapshot = await ref.get();
        const docs = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setAllData((prev) => {
          const newData = reset ? docs : [...prev, ...docs];
          cacheRef.current = newData;
          return newData;
        });

        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === PAGE_SIZE);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [state.label, city.value]
  );

  // Initial fetch on filter change
  useEffect(() => {
    if (!city || city.value === "_select_city") return;
    setAllData([]);
    setLastDoc(null);
    setHasMore(true);
    fetchAgents(true);
  }, [state, city]);

  // --- INFINITE SCROLL ---

  useEffect(() => {
    if (isInView && hasMore && !isLoading && lastDoc) {
      console.log("📍 Loading next batch...");
      fetchAgents(false, lastDoc);
    }
  }, [isInView, hasMore, isLoading, lastDoc, fetchAgents]);

  // --- CACHE PERSISTENCE ---

  // useEffect(() => {
  //   if (allData.length > 0) {
  //     localStorage.setItem("agentCache", JSON.stringify(allData));
  //   }
  // }, [allData]);

  // useEffect(() => {
  //   const savedCache = localStorage.getItem("agentCache");
  //   if (savedCache) {
  //     cacheRef.current = JSON.parse(savedCache);
  //     setAllData(cacheRef.current);
  //   }
  // }, []);
  // --- SEARCH LOGIC ---
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (debouncer.current) clearTimeout(debouncer.current);

    debouncer.current = setTimeout(async () => {
      const searchValue = value.trim();
      if (!searchValue) {
        setSearchResults([]);
        setAllData(cacheRef.current);
        return;
      }

      setIsLoading(true);
      setSearchLoading(true);

      try {
        const { results } = await client.search({
          requests: [
            {
              indexName: "agent-propdial",
              query: searchValue,
              filters: `state:"${state.label}" AND city:"${city.label}"`,
              attributesToHighlight: ["agentName", "agentPhone"],
            },
          ],
        });

        const hits = results?.[0]?.hits || [];
        setSearchResults(hits.map((hit) => ({ ...hit, id: hit.objectID })));
      } catch (error) {
        console.error("Algolia search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
        setSearchLoading(false);
      }
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (debouncer.current) clearTimeout(debouncer.current);
    };
  }, []);
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
            options={masterState}
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
          <Select
            className="state_filter"
            onChange={(e) => setCity(e)}
            options={cityOptions}
            value={city}
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
          {/* <div className="new_inline">
            <Filters changeFilter={setStatus} filterList={statusFilter} />
          </div> */}
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

      {/* Agent Data */}
      <div>
        {city.value === "_select_city" ? (
          <div className="pg_msg text-center">
            Please select a city to view agents.
          </div>
        ) : viewMode === "card_view" ? (
          <>
            {searchInput.trim() ? (
              searchResults.length > 0 ? (
                <AgentSingle agentDoc={searchResults} />
              ) : (
                !isLoading && (
                  <div className="pg_msg text-center">No results found.</div>
                )
              )
            ) : allData.length > 0 ? (
              <AgentSingle agentDoc={allData} />
            ) : (
              !isLoading && (
                <div className="pg_msg text-center">
                  No agents found in {city.label}.
                </div>
              )
            )}

            {isLoading && (
              <div className="filter_loading">
                <BeatLoader color="var(--theme-green)" />
              </div>
            )}

            {/* 👇 Infinite Scroll Trigger */}
            {!hasMore && !isLoading && allData.length > 0 ? (
              <div
                style={{
                  textAlign: "center",
                  fontSize: "16px",
                  color: "var(--theme-orange)",
                  fontWeight: "500",
                  margin: "10px 0px",
                }}
              >
                🎉 End of list
              </div>
            ) : (
              <div ref={setRef} style={{ height: "120px" }} />
            )}
          </>
        ) : (
          <>
            {searchInput.trim() ? (
              searchResults.length > 0 ? (
                <AgentTable agentDoc={searchResults} />
              ) : (
                !isLoading && (
                  <div className="pg_msg text-center">No results found.</div>
                )
              )
            ) : allData.length > 0 ? (
              <AgentTable agentDoc={allData} />
            ) : (
              !isLoading && (
                <div className="pg_msg text-center">
                  No agents found in {city.label}.
                </div>
              )
            )}

            {isLoading && (
              <div className="filter_loading">
                <BeatLoader color="var(--theme-green)" />
              </div>
            )}

            {!hasMore && !isLoading && allData.length > 0 ? (
              <div
                style={{
                  textAlign: "center",
                  fontSize: "16px",
                  color: "var(--theme-orange)",
                  fontWeight: "500",
                  margin: "10px 0px",
                }}
              >
                🎉 End of list
              </div>
            ) : (
              <div ref={setRef} style={{ height: "120px" }} />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ViewAgent;
