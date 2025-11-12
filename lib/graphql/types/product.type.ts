import { GetCollectionProductsQuery, ProductVariantFragment } from "../products/products.graphql";
import { ProductVariant } from "../shopify.schema";

export type ProductVariantItem = ProductVariantFragment & { quantity: number };

export type CollectionProduct = NonNullable<
  GetCollectionProductsQuery["collection"]
>["products"]["nodes"][number];

export type Collection = NonNullable<
  GetCollectionProductsQuery["collection"]
>;