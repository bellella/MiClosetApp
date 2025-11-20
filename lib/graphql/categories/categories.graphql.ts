import * as Types from '../shopify.schema';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type CollectionBasicFragment = { __typename?: 'Collection', id: string, title: string, handle: string, image?: { __typename?: 'Image', url: any, altText?: string | null } | null };

export type GetCategoriesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { __typename?: 'QueryRoot', menu?: { __typename?: 'Menu', title: string, items: Array<{ __typename?: 'MenuItem', title: string, resource?:
        | { __typename: 'Article' }
        | { __typename: 'Blog' }
        | { __typename: 'Collection', id: string, title: string, handle: string, image?: { __typename?: 'Image', url: any, altText?: string | null } | null }
        | { __typename: 'Metaobject' }
        | { __typename: 'Page' }
        | { __typename: 'Product' }
        | { __typename: 'ShopPolicy' }
       | null, items: Array<{ __typename?: 'MenuItem', title: string, resource?:
          | { __typename: 'Article' }
          | { __typename: 'Blog' }
          | { __typename: 'Collection', id: string, title: string, handle: string, image?: { __typename?: 'Image', url: any, altText?: string | null } | null }
          | { __typename: 'Metaobject' }
          | { __typename: 'Page' }
          | { __typename: 'Product' }
          | { __typename: 'ShopPolicy' }
         | null }> }> } | null };

export type GetSubCategoriesQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GetSubCategoriesQuery = { __typename?: 'QueryRoot', collection?: { __typename?: 'Collection', id: string, title: string, handle: string, metafield?: { __typename?: 'Metafield', type: string, references?: { __typename?: 'MetafieldReferenceConnection', nodes: Array<
          | { __typename: 'Collection', id: string, title: string, handle: string, image?: { __typename?: 'Image', url: any, altText?: string | null } | null }
          | { __typename: 'GenericFile' }
          | { __typename: 'MediaImage' }
          | { __typename: 'Metaobject' }
          | { __typename: 'Model3d' }
          | { __typename: 'Page' }
          | { __typename: 'Product' }
          | { __typename: 'ProductVariant' }
          | { __typename: 'Video' }
        > } | null } | null } | null };

export const CollectionBasicFragmentDoc = gql`
    fragment CollectionBasic on Collection {
  id
  title
  handle
  image {
    url
    altText
  }
}
    `;
export const GetCategoriesDocument = gql`
    query GetCategories {
  menu(handle: "categories") {
    title
    items {
      title
      resource {
        __typename
        ...CollectionBasic
      }
      items {
        title
        resource {
          __typename
          ...CollectionBasic
        }
      }
    }
  }
}
    ${CollectionBasicFragmentDoc}`;
export const GetSubCategoriesDocument = gql`
    query GetSubCategories($id: ID!) {
  collection(id: $id) {
    id
    title
    handle
    metafield(namespace: "custom", key: "sub_collection") {
      type
      references(first: 50) {
        nodes {
          __typename
          ...CollectionBasic
        }
      }
    }
  }
}
    ${CollectionBasicFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetCategories(variables?: GetCategoriesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetCategoriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCategoriesQuery>({ document: GetCategoriesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetCategories', 'query', variables);
    },
    GetSubCategories(variables: GetSubCategoriesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetSubCategoriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSubCategoriesQuery>({ document: GetSubCategoriesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetSubCategories', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;