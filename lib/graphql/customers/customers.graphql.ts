import * as Types from '../shopify.schema';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type GetCustomerQueryVariables = Types.Exact<{
  customerAccessToken: Types.Scalars['String']['input'];
}>;


export type GetCustomerQuery = { __typename?: 'QueryRoot', customer?: { __typename?: 'Customer', id: string, email?: string | null, firstName?: string | null, lastName?: string | null, phone?: string | null } | null };


export const GetCustomerDocument = gql`
    query GetCustomer($customerAccessToken: String!) {
  customer(customerAccessToken: $customerAccessToken) {
    id
    email
    firstName
    lastName
    phone
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetCustomer(variables: GetCustomerQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetCustomerQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCustomerQuery>({ document: GetCustomerDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetCustomer', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;