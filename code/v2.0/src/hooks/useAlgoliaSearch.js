import { useState, useCallback, useRef } from 'react';
import { getIndex, INDICES, SEARCH_CONFIG } from '../firebase/algoliaConfig';

export const useAlgoliaSearch = (indexName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  
  // Cache for search results
  const cacheRef = useRef(new Map());

  const search = useCallback(async (params = {}) => {
    if (loading) return null;

    setLoading(true);
    setError(null);

    try {
      const index = getIndex(indexName);
      
      const searchParams = {
        query: params.query || '',
        filters: params.filters,
        page: params.page || 0,
        hitsPerPage: params.hitsPerPage || SEARCH_CONFIG.HITS_PER_PAGE,
        facets: params.facets || SEARCH_CONFIG.FACETS,
        ...params
      };

      // Create cache key
      const cacheKey = JSON.stringify(searchParams);
      
      // Check cache first
      if (cacheRef.current.has(cacheKey)) {
        const cachedResults = cacheRef.current.get(cacheKey);
        setResults(cachedResults);
        return cachedResults;
      }

      const results = await index.search(searchParams.query, searchParams);
      
      // Cache the results
      cacheRef.current.set(cacheKey, results);
      setResults(results);
      
      return results;
    } catch (err) {
      console.error('Algolia search error:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [indexName, loading]);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    search,
    results,
    loading,
    error,
    clearCache
  };
};

// Specialized hook for agents
export const useAgentsSearch = () => {
  const { search, results, loading, error, clearCache } = useAlgoliaSearch(INDICES.AGENTS);
  
  const searchAgents = useCallback(async (params = {}) => {
    return await search(params);
  }, [search]);

  return {
    searchAgents,
    agents: results?.hits || [],
    totalCount: results?.nbHits || 0,
    loading,
    error,
    clearCache
  };
};