import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollection } from "../../../../hooks/useCollection";
import { useAgentsSearch } from "../../../../hooks/useAlgoliaSearch";
import Select from 'react-select';
import { BeatLoader } from 'react-spinners';
import { useCommon } from '../../../../hooks/useCommon';

const ViewAgents = () => {
  const navigate = useNavigate();
  const { camelCase } = useCommon();
  
  // State management
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Refs
  const pageRef = useRef(0);
  const observerRef = useRef(null);
  const lastAgentElementRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Master data
  const { documents: masterState } = useCollection("m_states", "", ["state", "asc"]);
  const { documents: masterCity } = useCollection("m_cities", "", ["city", "asc"]);
  
  // Algolia search hook
  const { searchAgents, loading: searchLoading, clearCache, error: searchError } = useAgentsSearch();

  // State options
  const stateOptions = useMemo(() => {
    if (!masterState) return [];
    return masterState.map(state => ({
      label: state.state,
      value: state.id  // Use state ID with underscore
    }));
  }, [masterState]);

  // City options filtered by selected state
  const cityOptions = useMemo(() => {
    if (!masterCity || !selectedState) return [];
    
    console.log('=== DEBUG CITY FILTERING ===');
    console.log('Selected State ID:', selectedState.value);
    
    const filteredCities = masterCity.filter(city => {
      return city.state === selectedState.value;
    });
    
    console.log('Filtered Cities:', filteredCities.map(c => c.city));
    console.log('=== END DEBUG ===');
    
    return filteredCities.map(city => ({
      label: city.city,
      value: city.city
    }));
  }, [masterCity, selectedState]);

  // Build filters for Algolia - CORRECTED: Get state name from state ID
  const buildFilters = useCallback(() => {
    let filters = '';
    
    if (selectedState) {
      // Find state name from selected state ID
      const stateObj = masterState?.find(state => state.id === selectedState.value);
      if (stateObj) {
        filters += `state:"${stateObj.state}"`; // Use state name without underscore
        console.log('State Filter:', `state:"${stateObj.state}"`);
      }
    }
    
    if (selectedCity) {
      if (filters) filters += ' AND ';
      filters += `city:"${selectedCity.value}"`;
      console.log('City Filter:', `city:"${selectedCity.value}"`);
    }
    
    console.log('Final Algolia Filters:', filters);
    return filters || undefined;
  }, [selectedState, selectedCity, masterState]);

  // Load agents with Algolia - ENHANCED: Better debugging
  const loadAgents = useCallback(async (reset = false) => {
    if (searchLoading) return;

    setLoading(true);
    const currentPage = reset ? 0 : pageRef.current;

    try {
      const filters = buildFilters();
      
      console.log('=== ALGOLIA SEARCH PARAMS ===');
      console.log('Query:', searchQuery);
      console.log('Filters:', filters);
      console.log('Page:', currentPage);
      console.log('=============================');

      const results = await searchAgents({
        query: searchQuery,
        filters: filters,
        page: currentPage,
        hitsPerPage: 20
      });

      console.log('=== ALGOLIA RESULTS ===');
      console.log('Total Hits:', results?.nbHits);
      console.log('Current Page:', results?.page);
      console.log('Total Pages:', results?.nbPages);
      console.log('Hits:', results?.hits);
      console.log('========================');

      if (results) {
        if (reset) {
          setAgents(results.hits);
        } else {
          setAgents(prev => [...prev, ...results.hits]);
        }
        
        setTotalCount(results.nbHits);
        setHasMore(results.page < results.nbPages - 1);
        
        if (reset) {
          pageRef.current = 0;
        } else {
          pageRef.current = currentPage + 1;
        }
      }
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setLoading(false);
    }
  }, [searchAgents, buildFilters, searchQuery, searchLoading]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      loadAgents(true);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, loadAgents]);

  // Load when filters change
  useEffect(() => {
    loadAgents(true);
  }, [selectedState, selectedCity, loadAgents]);

  // Infinite scroll observer
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadAgents(false);
        }
      },
      { threshold: 0.1 }
    );

    if (lastAgentElementRef.current) {
      observer.observe(lastAgentElementRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, loadAgents]);

  // Handler functions
  const handleStateChange = (option) => {
    console.log('State changed to:', option);
    setSelectedState(option);
    setSelectedCity(null);
    clearCache();
  };

  const handleCityChange = (option) => {
    console.log('City changed to:', option);
    setSelectedCity(option);
    clearCache();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearFilters = () => {
    setSelectedState(null);
    setSelectedCity(null);
    setSearchQuery('');
    clearCache();
    loadAgents(true);
  };

  const handleAddAgent = () => {
    navigate('/agents/new');
  };

  const handleEditAgent = (agentId) => {
    navigate(`/agents/${agentId}`);
  };

  // Enhanced Debug component
  const DebugData = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <div className="debug-info p-3 bg-light border rounded mb-3">
        <h6>Debug Information:</h6>
        
        {/* Search Status */}
        <div className="row mb-2">
          <div className="col-md-4">
            <strong>Search Status:</strong> 
            {searchLoading ? ' 🔄 Loading...' : searchError ? ' ❌ Error' : ' ✅ Ready'}
          </div>
          <div className="col-md-4">
            <strong>Total Agents:</strong> {totalCount}
          </div>
          <div className="col-md-4">
            <strong>Showing:</strong> {agents.length} agents
          </div>
        </div>

        {/* State & City Info */}
        <div className="row mb-2">
          <div className="col-md-6">
            <strong>Selected State:</strong> 
            {selectedState ? `${selectedState.label} (ID: ${selectedState.value})` : 'None'}
          </div>
          <div className="col-md-6">
            <strong>Selected City:</strong> 
            {selectedCity ? `${selectedCity.label}` : 'None'}
          </div>
        </div>

        {/* Available Cities */}
        {selectedState && (
          <div className="mb-2">
            <strong>Available Cities for {selectedState.label}:</strong>
            <div className="small mt-1">
              {cityOptions.length > 0 ? (
                cityOptions.slice(0, 8).map((city, index) => (
                  <span key={index} className="badge bg-success me-1 mb-1">{city.label}</span>
                ))
              ) : (
                <span className="text-danger">No cities found!</span>
              )}
              {cityOptions.length > 8 && `... +${cityOptions.length - 8} more`}
            </div>
          </div>
        )}

        {/* Current Agents Sample */}
        {agents.length > 0 && (
          <div className="mb-2">
            <strong>Sample Agents Found:</strong>
            <div className="small mt-1">
              {agents.slice(0, 3).map((agent, index) => (
                <div key={index} className="text-success">
                  ✓ {agent.agentName} - {agent.city}, {agent.state}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Query */}
        {searchQuery && (
          <div className="mb-2">
            <strong>Search Query:</strong> "{searchQuery}"
          </div>
        )}

        {/* Algolia Connection Test */}
        <div className="mt-3">
          <button 
            className="btn btn-sm btn-outline-primary me-2"
            onClick={() => loadAgents(true)}
          >
            Refresh Data
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              setSelectedState(null);
              setSelectedCity(null);
              setSearchQuery('');
              loadAgents(true);
            }}
          >
            Show All Agents
          </button>
        </div>
      </div>
    );
  };

  // Format locality and society for display
  const formatArrayData = (data) => {
    if (!data || !Array.isArray(data)) return '-';
    if (data.length === 0) return '-';
    
    return data
      .map(item => typeof item === 'object' ? item.label : item)
      .slice(0, 2)
      .join(', ') + (data.length > 2 ? ` +${data.length - 2} more` : '');
  };

  // Get active filters count
  const activeFiltersCount = (selectedState ? 1 : 0) + (selectedCity ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="top_header_pg pg_bg pg_agent">
      <div className="page_spacing">
        <div className="pg_header d-flex justify-content-between align-items-center">
          <div className="left d-flex align-items-center">
            <h2 className="m22">View Agents</h2>
            {totalCount > 0 && (
              <span className="total-count-badge">
                {totalCount.toLocaleString()} agents
              </span>
            )}
          </div>
          <button 
            className="theme_btn btn_fill no_icon d-flex align-items-center"
            onClick={handleAddAgent}
          >
            <span className="material-symbols-outlined me-2">add</span>
            Add Agent
          </button>
        </div>
        <hr />

        {/* Debug Info */}
        <DebugData />

        {/* Search Error Display */}
        {searchError && (
          <div className="alert alert-danger">
            <strong>Search Error:</strong> {searchError}
          </div>
        )}

        {/* Filters Section */}
        <div className="filter_section">
          <div className="row g-3">
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="form_field label_top">
                <label>State</label>
                <Select
                  options={stateOptions}
                  value={selectedState}
                  onChange={handleStateChange}
                  isClearable
                  placeholder="Select State"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      minHeight: '45px'
                    })
                  }}
                />
              </div>
            </div>
            
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="form_field label_top">
                <label>City</label>
                <Select
                  options={cityOptions}
                  value={selectedCity}
                  onChange={handleCityChange}
                  isClearable
                  isDisabled={!selectedState}
                  placeholder={selectedState ? "Select City" : "First select State"}
                  noOptionsMessage={() => selectedState ? "No cities found for this state" : "Select a state first"}
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      minHeight: '45px'
                    })
                  }}
                />
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-6">
              <div className="form_field label_top">
                <label>Search Agents</label>
                <div className="search_box position-relative">
                  <span className="material-symbols-outlined search-icon">search</span>
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search by name, phone, email, company..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  {searchQuery && (
                    <button
                      className="clear-search-btn"
                      onClick={() => setSearchQuery('')}
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-lg-4 col-md-6">
              <div className="form_field label_top">
                <label>Actions</label>
                <div className="d-flex gap-2">
                  {activeFiltersCount > 0 && (
                    <button
                      className="theme_btn btn_border no_icon flex-grow-1"
                      onClick={handleClearFilters}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="active-filters mt-3">
              <div className="d-flex flex-wrap gap-2">
                {selectedState && (
                  <span className="filter-tag">
                    State: {selectedState.label}
                    <button onClick={() => setSelectedState(null)}>×</button>
                  </span>
                )}
                {selectedCity && (
                  <span className="filter-tag">
                    City: {selectedCity.label}
                    <button onClick={() => setSelectedCity(null)}>×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="filter-tag">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>×</button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="vg12"></div>

        {/* Agents List */}
        <div className="agents_list_container">
          {agents.length === 0 && !loading && !searchLoading ? (
            <div className="no_data_found text-center py-5">
              <span className="material-symbols-outlined icon-lg">group_off</span>
              <h4 className="mt-3">No agents found</h4>
              <p className="text-muted">
                {activeFiltersCount > 0 
                  ? "Try adjusting your filters or search terms"
                  : "No agents available in the system"
                }
              </p>
              {activeFiltersCount > 0 && (
                <button
                  className="theme_btn btn_fill no_icon mt-3"
                  onClick={handleClearFilters}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div className="results-summary mb-3">
                <p className="text-muted">
                  Showing {agents.length} of {totalCount.toLocaleString()} agents
                  {selectedCity && ` in ${selectedCity.label}`}
                  {selectedState && !selectedCity && ` in ${selectedState.label}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>

              <div className="agents_grid">
                {agents.map((agent, index) => (
                  <div 
                    key={agent.objectID} 
                    className="agent_card"
                    ref={index === agents.length - 1 ? lastAgentElementRef : null}
                  >
                    <div className="agent_header">
                      <div className="agent_name_status">
                        <h4 className="agent_name">{camelCase(agent.agentName)}</h4>
                        <span className={`status_badge ${agent.status || 'active'}`}>
                          {agent.status || 'active'}
                        </span>
                      </div>
                      <div className="agent_actions">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => handleEditAgent(agent.objectID)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    
                    <div className="agent_details">
                      <div className="detail_row">
                        <span className="material-symbols-outlined">phone</span>
                        <span>{agent.agentPhone}</span>
                      </div>
                      
                      {agent.agentEmail && (
                        <div className="detail_row">
                          <span className="material-symbols-outlined">email</span>
                          <span className="text-truncate">{agent.agentEmail}</span>
                        </div>
                      )}
                      
                      <div className="detail_row">
                        <span className="material-symbols-outlined">location_on</span>
                        <span>
                          {agent.city}, {agent.state}
                          {agent.country && `, ${agent.country}`}
                        </span>
                      </div>
                      
                      {agent.agentCompnayName && (
                        <div className="detail_row">
                          <span className="material-symbols-outlined">business</span>
                          <span className="text-truncate">{agent.agentCompnayName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Loading indicator */}
              {(loading || searchLoading) && (
                <div className="loading_indicator text-center py-4">
                  <BeatLoader color={"var(--theme-green)"} />
                  <p className="mt-2 text-muted">Loading agents...</p>
                </div>
              )}

              {/* No more data message */}
              {!hasMore && agents.length > 0 && (
                <div className="no_more_data text-center py-3">
                  <p className="text-muted">No more agents to load</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAgents;