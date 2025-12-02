import { algoliasearch } from "algoliasearch";

export const client = algoliasearch(
  process.env.EXPO_PUBLIC_ALGOLIA_APP_ID!,
  process.env.EXPO_PUBLIC_ALGOLIA_API_KEY!
);

export enum AlgoliaIndex {
  PRODUCTS = "shopify_products",
  PRODUCTS_POPULAR = "shopify_products_recently_ordered_count_desc",
  PRODUCTS_NEWEST = "shopify_products_id_desc",
  PRODUCTS_PRICE_ASC = "shopify_products_price_asc",
  PRODUCTS_PRICE_DESC = "shopify_products_price_desc",
}

export type AlgoliaSearchParams = { index?: AlgoliaIndex; searchParams?: any };
export const algolia = {
  search: async (
    query: string,
    {
      index = AlgoliaIndex.PRODUCTS,
      searchParams = {},
    }: AlgoliaSearchParams = {}
  ) => {
    return client.searchSingleIndex({
      indexName: index,
      searchParams: {
        query,
        ...searchParams,
      },
    });
  },
};
