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

