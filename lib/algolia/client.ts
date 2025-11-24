import { algoliasearch } from "algoliasearch";

export const client = algoliasearch(
  process.env.EXPO_PUBLIC_ALGOLIA_APP_ID!,
  process.env.EXPO_PUBLIC_ALGOLIA_API_KEY!
);

const indexName = "shopify_products";

export const algolia = {
  // 🔍 일반 검색
  search: (query: string, options: any = {}) => {
    return client.searchSingleIndex({
      indexName,
      searchParams: {
        query,
        ...options,
      },
    });
  },

  // 🔎 facet value 검색
  searchFacets: (facetName: string) => {
    return client.searchForFacetValues({
      indexName,
      facetName,
    });
  },
};
