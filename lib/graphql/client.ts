import { GraphQLClient } from "graphql-request";
import { getSdk as getProductsSdk } from "./products/products.graphql";
import { getSdk as getCartSdk } from "./cart/cart.graphql";
import { getSdk as getOrderSdk } from "./orders/orders.graphql";
import { getSdk as getCustomersSdk } from "./customers/customers.graphql";
import { getSdk as getAuthSdk } from "./auth/auth.graphql";
import { getSdk as getCategoriesSdk } from "./categories/categories.graphql";

export const shopifyClient = new GraphQLClient(
  process.env.EXPO_PUBLIC_SHOPIFY_API_URL!,
  {
    headers: {
      "X-Shopify-Storefront-Access-Token": process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN!,
      "Content-Type": "application/json",
    }
  }
);

/**
 * Shopify SDK 생성기
 * - 각 도메인(products, collections, customers 등)을 모듈별로 확장 가능
 */
function createShopifySdk(client: any) {
  return {
    products: getProductsSdk(client),
    cart: getCartSdk(client),
    orders: getOrderSdk(client),
    auth: getAuthSdk(client),
    categories: getCategoriesSdk(client),
    // collections: getCollectionsSdk(client),
    customers: getCustomersSdk(client),
  };
}

export const shopifySdk = createShopifySdk(shopifyClient);
