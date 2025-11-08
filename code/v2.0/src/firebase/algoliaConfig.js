import { liteClient } from "algoliasearch/lite";

if (
  !process.env.REACT_APP_ALGOLIA_APP_ID ||
  !process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY
) {
  throw new Error("Missing algolia credentials");
}

console.log()

const client = liteClient(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY
);

export default client;


// import { liteClient } from 'algoliasearch/lite';

// // Check environment variables with better error handling
// const algoliaAppId = "CTC8D47YXI";
// const algoliaSearchKey = "81d53b19c83d0610730c7f59e32478f5";

// // Create a mock client for development when credentials are missing
// const createMockClient = () => {
//   console.warn('Using mock Algolia client - search will return empty results');
  
//   const mockIndex = {
//     search: async (query, options) => ({
//       hits: [],
//       nbHits: 0,
//       nbPages: 0,
//       page: options?.page || 0,
//       hitsPerPage: options?.hitsPerPage || 20,
//       processingTimeMS: 0,
//       query: query,
//       params: ''
//     })
//   };

//   return {
//     initIndex: () => mockIndex
//   };
// };

// // Initialize Algolia client with fallback
// let searchClient;

// if (algoliaAppId && algoliaSearchKey) {
//   try {
//     searchClient = liteClient(algoliaAppId, algoliaSearchKey);
//     console.log('Algolia client initialized successfully');
//   } catch (error) {
//     console.error('Failed to initialize Algolia client:', error);
//     searchClient = createMockClient();
//   }
// } else {
//   console.warn('Algolia credentials missing. Using mock client for development.');
//   searchClient = createMockClient();
// }

// // Index names
// export const INDICES = {
//   AGENTS: 'agents_propdial'
// };

// // Search configuration
// export const SEARCH_CONFIG = {
//   HITS_PER_PAGE: 20,
//   FACETS: ['state', 'city', 'status', 'searchable(locality)', 'searchable(society)'],
//   SEARCHABLE_ATTRIBUTES: [
//     'agentName',
//     'agentPhone', 
//     'agentEmail',
//     'agentCompnayName',
//     'state',
//     'city',
//     'locality',
//     'society',
//     'agentPancard',
//     'agentGstNumber'
//   ]
// };

// // Get index instance
// export const getIndex = (indexName) => {
//   return searchClient.initIndex(indexName);
// };

// export default searchClient;