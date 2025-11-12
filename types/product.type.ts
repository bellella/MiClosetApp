import { GetCollectionProductsQuery, ProductVariantFragment } from "@/lib/graphql/products/products.graphql";

export type ProductCard = {
  id: string;
  name: string;
  brand: string;
  description: string;
  image: string;
  price: number;
  discountRate: number;
  reviewCount: number;
  isLiked: boolean;
};

export type ProductDetail = {
  id: string;
  name: string;
  brand: string;
  description?: string;
  descriptionHtml?: string;
  images: string[];
  price: number;
  discountRate: number;
  variants: {
    id: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
  }[];
};

export type ProductVariant = {
  id: string;
  title: string;
  price: Money;
  availableForSale: boolean;
};

export type Image = {
  id?: string;
  url: string;
  altText?: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductVariantItem = ProductVariantFragment & { quantity: number };

export type CollectionProduct = NonNullable<
  GetCollectionProductsQuery["collection"]
>["products"]["nodes"][number];

export type Collection = NonNullable<
  GetCollectionProductsQuery["collection"]
>;

export type ProductCollectionProps = {
  products: CollectionProduct[];
  title?: string;
  onPressMore?: () => void;
};