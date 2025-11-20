import React from "react";
import { Box } from "@/components/ui/box";
import { useQueries } from "@tanstack/react-query";
import { shopifySdk } from "@/lib/graphql/client";
import { ProductCollectionProps } from "@/types";
import { ProductListGrid } from "../products/product-list/Grid";
import { ProductListSlider } from "../products/product-list/Slider";

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

  return (
    <>
      {COLLECTIONS.map(({ handle, ui }, index) => {
        const { data, isLoading, isError } = results[index];
        if (isLoading || isError || !data?.collection) return null;

        const Component = collectionUIMap[ui];
        return (
          <Box key={handle} className="space-y-4">
            <Component
              title={data.collection.title ?? ""}
              products={data.collection.products.nodes ?? []}
            />
          </Box>
        );
      })}
    </>
  );
}
