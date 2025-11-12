import { ProductCard, ProductDetail } from "@/types";
import { graphql, flattenConnection } from "@/lib/api";

// -------------------------
// Get Collection Products
// -------------------------

export const GET_COLLECTION_PRODUCTS_QUERY = `
  query GetCollectionProducts($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      id
      title
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            id
            title
            description
            vendor
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  price {
                    amount
                  }
                  compareAtPrice {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

type GetCollectionProductsResponse = {
  collection: {
    id: string;
    title: string;
    products: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
      edges: {
        cursor: string;
        node: {
          id: string;
          title: string;
          description?: string;
          vendor: string;
          images: {
            edges: { node: { url: string } }[];
          };
          variants: {
            edges: {
              node: {
                price: { amount: string };
                compareAtPrice: { amount: string } | null;
              };
            }[];
          };
        };
      }[];
    };
  } | null;
};

export const getCollectionProducts = async (
  handle: string,
  first: number,
  after?: string
): Promise<{
  products: ProductCard[];
  hasNextPage: boolean;
  endCursor: string | null;
}> => {
  const { original } = await graphql<GetCollectionProductsResponse>(
    GET_COLLECTION_PRODUCTS_QUERY,
    { handle, first, after }
  );

  if (!original.collection) {
    return { products: [], hasNextPage: false, endCursor: null };
  }

  const products = flattenConnection(original.collection.products).map((item) => {
    const variant = flattenConnection(item.variants)[0];
    const price = parseInt(variant?.price?.amount ?? "0", 10);
    const compareAt = variant?.compareAtPrice?.amount
      ? parseInt(variant.compareAtPrice.amount, 10)
      : null;

    const discountRate =
      compareAt && compareAt > price ? Math.floor(((compareAt - price) / compareAt) * 100) : 0;

    return {
      id: item.id,
      name: item.title,
      brand: item.vendor,
      description: item.description || "",
      image: flattenConnection(item.images)[0]?.url || "",
      price,
      discountRate,
      reviewCount: 0,
      isLiked: false,
    };
  });

  return {
    products,
    hasNextPage: original.collection.products.pageInfo.hasNextPage,
    endCursor: original.collection.products.pageInfo.endCursor || null,
  };
};

// -------------------------
// Get Product Detail (By GID)
// -------------------------

export const GET_PRODUCT_DETAIL_BY_ID_QUERY = `
  query GetProductById($id: ID!) {
    node(id: $id) {
      ... on Product {
        id
        title
        description
        descriptionHtml
        vendor
        images(first: 10) {
          edges {
            node {
              url
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
              }
              compareAtPrice {
                amount
              }
            }
          }
        }
      }
    }
  }
`;

type GetProductByIdResponse = {
  node: {
    id: string;
    title: string;
    description: string;
    descriptionHtml: string;
    vendor: string;
    images: {
      edges: { node: { url: string } }[];
    };
    variants: {
      edges: {
        node: {
          id: string;
          title: string;
          price: { amount: string };
          compareAtPrice: { amount: string } | null;
        };
      }[];
    };
  } | null;
};

export const getProductDetail = async (
  id: string
): Promise<ProductDetail | null> => {
  const { original } = await graphql<GetProductByIdResponse>(
    GET_PRODUCT_DETAIL_BY_ID_QUERY,
    { id }
  );

  const product = original.node;
  if (!product) return null;

  const variants = flattenConnection(product.variants);
  const firstVariant = variants[0];

  const price = parseInt(firstVariant?.price?.amount ?? "0", 10);
  const compareAt = parseInt(firstVariant?.compareAtPrice?.amount ?? "0", 10);
  const discountRate = compareAt > price ? Math.floor(((compareAt - price) / compareAt) * 100) : 0;

  return {
    id: product.id,
    name: product.title,
    brand: product.vendor,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    images: flattenConnection(product.images).map((i) => i.url),
    price,
    discountRate,
    variants: variants.map((v) => ({
      id: v.id,
      title: v.title,
      price: parseInt(v.price.amount, 10),
      compareAtPrice: v.compareAtPrice?.amount
        ? parseInt(v.compareAtPrice.amount, 10)
        : null,
    })),
  };
};


import { gql } from '@apollo/client';

export const GET_PRODUCT_DETAIL_BY_ID = gql`
  query GetProductById($id: ID!) {
    node(id: $id) {
      ... on Product {
        id
        title
        description
        descriptionHtml
        vendor
        images(first: 10) {
          nodes {
            url
          }
        }
        variants(first: 10) {
          nodes {
            id
            title
            price {
              amount
            }
            compareAtPrice {
              amount
            }
          }
        }
      }
    }
  }
`;