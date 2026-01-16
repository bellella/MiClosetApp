import { useCallback } from "react";
import { ProductItem, CollectionProduct } from "@/types/product.type";
import { useWishlistIdsMap } from "./useWishlist";

export type AlgoliaProduct = {
  id: string;
  title: string;
  vendor?: string;
  price?: number;
  compare_at_price?: number;
  image?: string;
  handle?: string;
  body_html?: string;
  product_type?: string;
  tags?: string[];
  options?: Record<string, any>;
};
/**
 * Product 변환 함수를 제공하는 훅
 * wishListMap을 자동으로 주입하여 변환 함수를 반환
 */
export function useProductConverter() {
  const wishListMap = useWishlistIdsMap();

  const shopifyToProductCard = useCallback(
    (product: CollectionProduct): ProductItem => {
      const price = Number(product.priceRange?.minVariantPrice?.amount ?? 0);
      const compareAtPrice = 0; // TODO: compareAtPrice 필드 추가 필요
      const discountRate =
        compareAtPrice > 0
          ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
          : 0;

      return {
        id: product.id,
        title: product.title,
        brand: "Unknown", // TODO: vendor 필드 GraphQL에 추가 필요
        description: "", // TODO: description 필드 GraphQL에 추가 필요
        imageUrl: product.featuredImage?.url || "",
        price,
        discountRate,
        reviewCount: 0, // TODO: 리뷰 데이터 추가 필요
        isLiked: wishListMap?.[product.id] ?? false,
      };
    },
    [wishListMap]
  );

  const shopifyToProductCards = useCallback(
    (products: CollectionProduct[]): ProductItem[] => {
      return products.map(shopifyToProductCard);
    },
    [shopifyToProductCard]
  );

  const algoliaToProductCard = useCallback(
    (product: AlgoliaProduct): ProductItem => {
      const price = product.price || 0;
      const compareAtPrice = product.compare_at_price || 0;
      const discountRate =
        compareAtPrice > 0
          ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
          : 0;

      return {
        id: `gid://shopify/Product/${product.id}`,
        title: product.title,
        brand: product.vendor || "Unknown",
        description: product.body_html || "",
        imageUrl: product.image || "",
        price,
        discountRate,
        reviewCount: 0,
        isLiked: wishListMap?.[`gid://shopify/Product/${product.id}`] ?? false,
      };
    },
    [wishListMap]
  );

  const algoliaToProductCards = useCallback(
    (products: AlgoliaProduct[]): ProductItem[] => {
      return products.map(algoliaToProductCard);
    },
    [algoliaToProductCard]
  );

  return {
    shopifyToProductCard,
    shopifyToProductCards,
    algoliaToProductCard,
    algoliaToProductCards,
  };
}
