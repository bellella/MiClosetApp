import * as Types from '../shopify.schema';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type CustomerCreateMutationVariables = Types.Exact<{
  input: Types.CustomerCreateInput;
}>;


export type CustomerCreateMutation = { __typename?: 'Mutation', customerCreate?: { __typename?: 'CustomerCreatePayload', customer?: { __typename?: 'Customer', id: string, email?: string | null, firstName?: string | null, lastName?: string | null } | null, customerUserErrors: Array<{ __typename?: 'CustomerUserError', code?: Types.CustomerErrorCode | null, field?: Array<string> | null, message: string }> } | null };

export type CustomerAccessTokenCreateMutationVariables = Types.Exact<{
  input: Types.CustomerAccessTokenCreateInput;
}>;


export type CustomerAccessTokenCreateMutation = { __typename?: 'Mutation', customerAccessTokenCreate?: { __typename?: 'CustomerAccessTokenCreatePayload', customerAccessToken?: { __typename?: 'CustomerAccessToken', accessToken: string, expiresAt: any } | null, customerUserErrors: Array<{ __typename?: 'CustomerUserError', code?: Types.CustomerErrorCode | null, field?: Array<string> | null, message: string }> } | null };

export type CustomerAccessTokenRenewMutationVariables = Types.Exact<{
  customerAccessToken: Types.Scalars['String']['input'];
}>;


export type CustomerAccessTokenRenewMutation = { __typename?: 'Mutation', customerAccessTokenRenew?: { __typename?: 'CustomerAccessTokenRenewPayload', customerAccessToken?: { __typename?: 'CustomerAccessToken', accessToken: string, expiresAt: any } | null, userErrors: Array<{ __typename?: 'UserError', field?: Array<string> | null, message: string }> } | null };


export const CustomerCreateDocument = gql`
    mutation CustomerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
      id
      email
      firstName
      lastName
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}
    `;
export const CustomerAccessTokenCreateDocument = gql`
    mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}
    `;
export const CustomerAccessTokenRenewDocument = gql`
    mutation CustomerAccessTokenRenew($customerAccessToken: String!) {
  customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    userErrors {
      field
      message
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CustomerCreate(variables: CustomerCreateMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CustomerCreateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CustomerCreateMutation>({ document: CustomerCreateDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CustomerCreate', 'mutation', variables);
    },
    CustomerAccessTokenCreate(variables: CustomerAccessTokenCreateMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CustomerAccessTokenCreateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CustomerAccessTokenCreateMutation>({ document: CustomerAccessTokenCreateDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CustomerAccessTokenCreate', 'mutation', variables);
    },
    CustomerAccessTokenRenew(variables: CustomerAccessTokenRenewMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CustomerAccessTokenRenewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CustomerAccessTokenRenewMutation>({ document: CustomerAccessTokenRenewDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CustomerAccessTokenRenew', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;