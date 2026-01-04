import { AppContainer } from "@/components/app/app-container";
import { ProductListGrid } from "@/components/products/product-list/Grid";
import { shopifySdk } from "@/lib/graphql/client";
import { Product } from "@/lib/graphql/shopify.schema";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { useWishlistIds } from "@/lib/hooks/useWishlist";
import { shopifyToProductCards } from "@/lib/utils/product.utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function WishlistScreen() {
  useAuthGuard();

  const {
    data: wishlistData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWishlistIds();

  const { data: products } = useQuery({
    queryKey: ["wishlist-products", wishlistData?.ids],
    queryFn: async () => {
      if (!wishlistData?.ids || wishlistData.ids.length === 0) return [];
      const { nodes } = await shopifySdk.products.getProductsByIds({
        ids: wishlistData.ids,
      });
      return nodes as Product[];
    },
    enabled: !!wishlistData?.ids && wishlistData.ids.length > 0,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const items = useMemo(() => {
    return products
      ? shopifyToProductCards(products, wishlistData?.idsMap)
      : [];
  }, [products, wishlistData?.idsMap]);

  return (
    <AppContainer
      headerTitle="찜한 상품"
      showHeaderLogo={true}
      showHeaderCart={true}
      disableScroll={true}
    >
      <ProductListGrid
        products={items}
        onEndReached={handleLoadMore}
        isLoadingMore={isFetchingNextPage}
      />
    </AppContainer>
  );
}
