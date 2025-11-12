import * as Types from '../shopify.schema';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type CartLineVariantFragment = { __typename?: 'ProductVariant', id: string, title: string, availableForSale: boolean, price: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode }, product: { __typename?: 'Product', title: string, vendor: string, featuredImage?: { __typename?: 'Image', url: any } | null } };

export type CreateCartMutationVariables = Types.Exact<{
  lines?: Types.InputMaybe<Array<Types.CartLineInput> | Types.CartLineInput>;
  buyerIdentity?: Types.InputMaybe<Types.CartBuyerIdentityInput>;
}>;


export type CreateCartMutation = { __typename?: 'Mutation', cartCreate?: { __typename?: 'CartCreatePayload', cart?: { __typename?: 'Cart', id: string, checkoutUrl: any, createdAt: any, lines: { __typename?: 'BaseCartLineConnection', edges: Array<{ __typename?: 'BaseCartLineEdge', node:
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

export type UpdateCartLineMutationVariables = Types.Exact<{
  cartId: Types.Scalars['ID']['input'];
  lines: Array<Types.CartLineUpdateInput> | Types.CartLineUpdateInput;
}>;


export type UpdateCartLineMutation = { __typename?: 'Mutation', cartLinesUpdate?: { __typename?: 'CartLinesUpdatePayload', cart?: { __typename?: 'Cart', id: string, lines: { __typename?: 'BaseCartLineConnection', edges: Array<{ __typename?: 'BaseCartLineEdge', node:
            | { __typename?: 'CartLine', id: string, quantity: number }
            | { __typename?: 'ComponentizableCartLine', id: string, quantity: number }
           }> } } | null, userErrors: Array<{ __typename?: 'CartUserError', field?: Array<string> | null, message: string }> } | null };

export type RemoveCartLineMutationVariables = Types.Exact<{
  cartId: Types.Scalars['ID']['input'];
  lineIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type RemoveCartLineMutation = { __typename?: 'Mutation', cartLinesRemove?: { __typename?: 'CartLinesRemovePayload', cart?: { __typename?: 'Cart', id: string } | null, userErrors: Array<{ __typename?: 'CartUserError', field?: Array<string> | null, message: string }> } | null };

export type AddToCartMutationVariables = Types.Exact<{
  cartId: Types.Scalars['ID']['input'];
  lines: Array<Types.CartLineInput> | Types.CartLineInput;
}>;


export type AddToCartMutation = { __typename?: 'Mutation', cartLinesAdd?: { __typename?: 'CartLinesAddPayload', cart?: { __typename?: 'Cart', id: string, lines: { __typename?: 'BaseCartLineConnection', edges: Array<{ __typename?: 'BaseCartLineEdge', node:
            | { __typename?: 'CartLine', id: string, quantity: number, merchandise: { __typename?: 'ProductVariant', id: string, title: string, product: { __typename?: 'Product', title: string } } }
            | { __typename?: 'ComponentizableCartLine', id: string, quantity: number, merchandise: { __typename?: 'ProductVariant', id: string, title: string, product: { __typename?: 'Product', title: string } } }
           }> } } | null } | null };

export type BuyNowMutationVariables = Types.Exact<{
  lines: Array<Types.CartLineInput> | Types.CartLineInput;
}>;


export type BuyNowMutation = { __typename?: 'Mutation', cartCreate?: { __typename?: 'CartCreatePayload', cart?: { __typename?: 'Cart', id: string, checkoutUrl: any } | null } | null };

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
export const CreateCartDocument = gql`
    mutation CreateCart($lines: [CartLineInput!], $buyerIdentity: CartBuyerIdentityInput) {
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
export const UpdateCartLineDocument = gql`
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
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
export const RemoveCartLineDocument = gql`
    mutation RemoveCartLine($cartId: ID!, $lineIds: [ID!]!) {
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
export const AddToCartDocument = gql`
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
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
export const BuyNowDocument = gql`
    mutation BuyNow($lines: [CartLineInput!]!) {
  cartCreate(input: {lines: $lines}) {
    cart {
      id
      checkoutUrl
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CreateCart(variables?: CreateCartMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateCartMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCartMutation>({ document: CreateCartDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateCart', 'mutation', variables);
    },
    GetCartById(variables: GetCartByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetCartByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCartByIdQuery>({ document: GetCartByIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetCartById', 'query', variables);
    },
    UpdateCartLine(variables: UpdateCartLineMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateCartLineMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateCartLineMutation>({ document: UpdateCartLineDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateCartLine', 'mutation', variables);
    },
    RemoveCartLine(variables: RemoveCartLineMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RemoveCartLineMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveCartLineMutation>({ document: RemoveCartLineDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RemoveCartLine', 'mutation', variables);
    },
    AddToCart(variables: AddToCartMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AddToCartMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddToCartMutation>({ document: AddToCartDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AddToCart', 'mutation', variables);
    },
    BuyNow(variables: BuyNowMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuyNowMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuyNowMutation>({ document: BuyNowDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuyNow', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;