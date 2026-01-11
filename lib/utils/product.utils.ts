import { ProductItem, CollectionProduct } from "@/types/product.type";
import { WishListMap } from "../hooks/useWishlist";

/**
 * Algolia에서 반환되는 Product 타입
 * Shopify + Algolia 통합 기준
 */
export type AlgoliaProduct = {
  objectID: string;
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
 * Shopify GraphQL Product를 ProductCard로 변환
 * @param product - Shopify GraphQL에서 반환된 CollectionProduct
 * @returns ProductCard 타입
 */
export function shopifyToProductCard(
  product: CollectionProduct,
  wishListMap?: WishListMap
): ProductItem {
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
}

/**
 * Shopify GraphQL Product 배열을 ProductCard 배열로 변환
 * @param products - Shopify GraphQL에서 반환된 CollectionProduct 배열
 * @returns ProductCard 배열
 */
export function shopifyToProductCards(
  products: CollectionProduct[],
  wishListMap?: WishListMap
): ProductItem[] {
  return products.map((p) => shopifyToProductCard(p, wishListMap));
}

/**
 * Algolia Product를 ProductCard로 변환
 * @param product - Algolia에서 반환된 AlgoliaProduct
 * @returns ProductCard 타입
 */
export function algoliaToProductCard(
  product: AlgoliaProduct,
  wishListMap?: WishListMap
): ProductItem {
  const price = product.price || 0;
  const compareAtPrice = product.compare_at_price || 0;
  const discountRate =
    compareAtPrice > 0
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  return {
    id: product.objectID,
    title: product.title,
    brand: product.vendor || "Unknown",
    description: product.body_html || "",
    imageUrl: product.image || "",
    price,
    discountRate,
    reviewCount: 0, // TODO: 리뷰 데이터 추가 필요
    isLiked: wishListMap?.[product.objectID] ?? false,
  };
}

/**
 * Algolia Product 배열을 ProductCard 배열로 변환
 * @param products - Algolia에서 반환된 AlgoliaProduct 배열
 * @returns ProductCard 배열
 */
export function algoliaToProductCards(
  products: AlgoliaProduct[],
  wishListMap?: WishListMap
): ProductItem[] {
  return products.map((p) => algoliaToProductCard(p, wishListMap));
}
