import * as Types from '../shopify.schema';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type GetCustomerOrdersQueryVariables = Types.Exact<{
  customerAccessToken: Types.Scalars['String']['input'];
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetCustomerOrdersQuery = { __typename?: 'QueryRoot', customer?: { __typename?: 'Customer', orders: { __typename?: 'OrderConnection', edges: Array<{ __typename?: 'OrderEdge', cursor: string, node: { __typename?: 'Order', id: string, name: string, orderNumber: number, processedAt: any, financialStatus?: Types.OrderFinancialStatus | null, fulfillmentStatus: Types.OrderFulfillmentStatus, totalPrice: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode }, lineItems: { __typename?: 'OrderLineItemConnection', edges: Array<{ __typename?: 'OrderLineItemEdge', node: { __typename?: 'OrderLineItem', title: string, quantity: number, discountedTotalPrice: { __typename?: 'MoneyV2', amount: any }, variant?: { __typename?: 'ProductVariant', title: string, image?: { __typename?: 'Image', url: any, altText?: string | null } | null } | null } }> } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } } | null };


export const GetCustomerOrdersDocument = gql`
    query GetCustomerOrders($customerAccessToken: String!, $first: Int!, $after: String) {
  customer(customerAccessToken: $customerAccessToken) {
    orders(first: $first, after: $after, reverse: true) {
      edges {
        node {
          id
          name
          orderNumber
          processedAt
          totalPrice {
            amount
            currencyCode
          }
          financialStatus
          fulfillmentStatus
          lineItems(first: 5) {
            edges {
              node {
                title
                quantity
                discountedTotalPrice {
                  amount
                }
                variant {
                  image {
                    url
                    altText
                  }
                  title
                }
              }
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetCustomerOrders(variables: GetCustomerOrdersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetCustomerOrdersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCustomerOrdersQuery>({ document: GetCustomerOrdersDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetCustomerOrders', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;