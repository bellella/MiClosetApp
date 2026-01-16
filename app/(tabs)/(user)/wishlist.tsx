import { AppContainer } from "@/components/app/app-container";
import { ProductListGrid } from "@/components/products/product-list/Grid";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { useWishlistProducts } from "@/lib/hooks/useWishlist";
import { useProductConverter } from "@/lib/hooks/useProductConverter";
import { useMemo } from "react";

export default function WishlistScreen() {
  useAuthGuard();
  const { shopifyToProductCards } = useProductConverter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWishlistProducts();

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const items = useMemo(() => {
    if (!data?.pages) return [];
    const allProducts = data.pages.flatMap((page) => page.products);
    return shopifyToProductCards(allProducts);
  }, [data?.pages, shopifyToProductCards]);

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
