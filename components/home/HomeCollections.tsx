import React from "react";
import { Box } from "@/components/ui/box";
import { useQueries } from "@tanstack/react-query";
import { shopifySdk } from "@/lib/graphql/client";
import { ProductCollectionProps } from "@/types";
import { ProductListGrid } from "../products/product-list/Grid";
import { ProductListSlider } from "../products/product-list/Slider";
import { shopifyToProductCards } from "@/lib/utils/product.utils";
import { useWishlistIds } from "@/lib/hooks/useWishlist";

export type ProductUIType = "grid" | "slider";

const COLLECTIONS = [
  { handle: "sale2", ui: "slider" },
  { handle: "new-arrivals", ui: "grid" },
  { handle: "best-sellers", ui: "slider" },
] as const;

const collectionUIMap: Record<
  ProductUIType,
  React.FC<ProductCollectionProps>
> = {
  grid: ProductListGrid,
  slider: ProductListSlider,
};

export function HomeCollections() {
  const { data: wishListData } = useWishlistIds();
  const results = useQueries({
    queries: COLLECTIONS.map(({ handle }) => ({
      queryKey: ["collection", handle],
      queryFn: () =>
        shopifySdk.products.GetCollectionProductsByHandle({
          handle,
          first: 10,
        }),
    })),
  });
  console.log(wishListData?.idsMap, "??");

  return (
    <>
      {COLLECTIONS.map(({ handle, ui }, index) => {
        const { data, isLoading, isError } = results[index];
        if (isLoading || isError || !data?.collection) return null;

        const Component = collectionUIMap[ui];
        const products = shopifyToProductCards(
          data.collection.products.nodes,
          wishListData?.idsMap
        );
        return (
          <Box key={handle} className="space-y-4">
            <Component
              title={data.collection.title ?? ""}
              products={products}
            />
          </Box>
        );
      })}
    </>
  );
}
