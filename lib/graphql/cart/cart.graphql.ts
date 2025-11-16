import * as Types from '../shopify.schema';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type CartLineVariantFragment = { __typename?: 'ProductVariant', id: string, title: string, availableForSale: boolean, price: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode }, product: { __typename?: 'Product', title: string, vendor: string, featuredImage?: { __typename?: 'Image', url: any } | null } };

export type CartCreateMutationVariables = Types.Exact<{
  lines?: Types.InputMaybe<Array<Types.CartLineInput> | Types.CartLineInput>;
  buyerIdentity?: Types.InputMaybe<Types.CartBuyerIdentityInput>;
}>;


export type CartCreateMutation = { __typename?: 'Mutation', cartCreate?: { __typename?: 'CartCreatePayload', cart?: { __typename?: 'Cart', id: string, checkoutUrl: any, createdAt: any, lines: { __typename?: 'BaseCartLineConnection', edges: Array<{ __typename?: 'BaseCartLineEdge', node:
            | { __typename?: 'CartLine', id: string, quantity: number, merchandise: { __typename?: 'ProductVariant', id: string, title: string, availableForSale: boolean, price: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode }, product: { __typename?: 'Product', title: string, vendor: string, featuredImage?: { __typename?: 'Image', url: any } | null } } }
            | { __typename?: 'ComponentizableCartLine', id: string, quantity: number, merchandise: { __typename?: 'ProductVariant', id: string, title: string, availableForSale: boolean, price: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode }, product: { __typename?: 'Product', title: string, vendor: string, featuredImage?: { __typename?: 'Image', url: any } | null } } }
           }> }, estimatedCost: { __typename?: 'CartEstimatedCost', subtotalAmount: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode }, totalTaxAmount?: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode } | null, totalAmount: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode } } } | null, userErrors: Array<{ __typename?: 'CartUserError', field?: Array<string> | null, message: string }> } | null };

export type GetCartByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GetCartByIdQuery = { __typename?: 'QueryRoot', cart?: { __typename?: 'Cart', id: string, checkoutUrl: any, buyerIdentity: { __typename?: 'CartBuyerIdentity', email?: string | null, phone?: string | null, countryCode?: Types.CountryCode | null, customer?: { __typename?: 'Customer', id: string } | null }, lines: { __typename?: 'BaseCartLineConnection', edges: Array<{ __typename?: 'BaseCartLineEdge', node:
          | { __typename?: 'CartLine', id: string, quantity: number, merchandise: { __typename?: 'ProductVariant', id: string, title: string, availableForSale: boolean, price: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode }, product: { __typename?: 'Product', title: string, vendor: string, featuredImage?: { __typename?: 'Image', url: any } | null } } }
          | { __typename?: 'ComponentizableCartLine', id: string, quantity: number, merchandise: { __typename?: 'ProductVariant', id: string, title: string, availableForSale: boolean, price: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode }, product: { __typename?: 'Product', title: string, vendor: string, featuredImage?: { __typename?: 'Image', url: any } | null } } }
         }> }, estimatedCost: { __typename?: 'CartEstimatedCost', subtotalAmount: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode }, totalTaxAmount?: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode } | null, totalAmount: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode } } } | null };

export type CartLinesUpdateMutationVariables = Types.Exact<{
  cartId: Types.Scalars['ID']['input'];
  lines: Array<Types.CartLineUpdateInput> | Types.CartLineUpdateInput;
}>;


export type CartLinesUpdateMutation = { __typename?: 'Mutation', cartLinesUpdate?: { __typename?: 'CartLinesUpdatePayload', cart?: { __typename?: 'Cart', id: string, lines: { __typename?: 'BaseCartLineConnection', edges: Array<{ __typename?: 'BaseCartLineEdge', node:
            | { __typename?: 'CartLine', id: string, quantity: number }
            | { __typename?: 'ComponentizableCartLine', id: string, quantity: number }
           }> } } | null, userErrors: Array<{ __typename?: 'CartUserError', field?: Array<string> | null, message: string }> } | null };

export type CartLinesRemoveMutationVariables = Types.Exact<{
  cartId: Types.Scalars['ID']['input'];
  lineIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type CartLinesRemoveMutation = { __typename?: 'Mutation', cartLinesRemove?: { __typename?: 'CartLinesRemovePayload', cart?: { __typename?: 'Cart', id: string } | null, userErrors: Array<{ __typename?: 'CartUserError', field?: Array<string> | null, message: string }> } | null };

export type CartLinesAddMutationVariables = Types.Exact<{
  cartId: Types.Scalars['ID']['input'];
  lines: Array<Types.CartLineInput> | Types.CartLineInput;
}>;


export type CartLinesAddMutation = { __typename?: 'Mutation', cartLinesAdd?: { __typename?: 'CartLinesAddPayload', cart?: { __typename?: 'Cart', id: string, lines: { __typename?: 'BaseCartLineConnection', edges: Array<{ __typename?: 'BaseCartLineEdge', node:
            | { __typename?: 'CartLine', id: string, quantity: number, merchandise: { __typename?: 'ProductVariant', id: string, title: string, product: { __typename?: 'Product', title: string } } }
            | { __typename?: 'ComponentizableCartLine', id: string, quantity: number, merchandise: { __typename?: 'ProductVariant', id: string, title: string, product: { __typename?: 'Product', title: string } } }
           }> } } | null } | null };

export const CartLineVariantFragmentDoc = gql`
    fragment CartLineVariant on ProductVariant {
  id
  title
  availableForSale
  price {
    amount
    currencyCode
  }
  product {
    title
    vendor
    featuredImage {
      url
    }
  }
}
    `;
export const CartCreateDocument = gql`
    mutation cartCreate($lines: [CartLineInput!], $buyerIdentity: CartBuyerIdentityInput) {
  cartCreate(input: {lines: $lines, buyerIdentity: $buyerIdentity}) {
    cart {
      id
      checkoutUrl
      createdAt
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                ...CartLineVariant
              }
            }
          }
        }
      }
      estimatedCost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
    ${CartLineVariantFragmentDoc}`;
export const GetCartByIdDocument = gql`
    query GetCartById($id: ID!) {
  cart(id: $id) {
    id
    buyerIdentity {
      email
      phone
      countryCode
      customer {
        id
      }
    }
    checkoutUrl
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              ...CartLineVariant
            }
          }
        }
      }
    }
    estimatedCost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
  }
}
    ${CartLineVariantFragmentDoc}`;
export const CartLinesUpdateDocument = gql`
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      id
      lines(first: 100) {
        edges {
          node {
            id
            quantity
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
    `;
export const CartLinesRemoveDocument = gql`
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      id
    }
    userErrors {
      field
      message
    }
  }
}
    `;
export const CartLinesAddDocument = gql`
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    cartCreate(variables?: CartCreateMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CartCreateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CartCreateMutation>({ document: CartCreateDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'cartCreate', 'mutation', variables);
    },
    GetCartById(variables: GetCartByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetCartByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCartByIdQuery>({ document: GetCartByIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetCartById', 'query', variables);
    },
    cartLinesUpdate(variables: CartLinesUpdateMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CartLinesUpdateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CartLinesUpdateMutation>({ document: CartLinesUpdateDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'cartLinesUpdate', 'mutation', variables);
    },
    cartLinesRemove(variables: CartLinesRemoveMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CartLinesRemoveMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CartLinesRemoveMutation>({ document: CartLinesRemoveDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'cartLinesRemove', 'mutation', variables);
    },
    cartLinesAdd(variables: CartLinesAddMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CartLinesAddMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CartLinesAddMutation>({ document: CartLinesAddDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'cartLinesAdd', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;