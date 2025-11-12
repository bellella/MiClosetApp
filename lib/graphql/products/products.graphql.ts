import * as Types from '../shopify.schema';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type GetProductsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetProductsQuery = { __typename?: 'QueryRoot', products: { __typename?: 'ProductConnection', nodes: Array<{ __typename?: 'Product', id: string, title: string, handle: string, featuredImage?: { __typename?: 'Image', url: any, altText?: string | null } | null, priceRange: { __typename?: 'ProductPriceRange', minVariantPrice: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode } } }> } };

export type GetProductByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GetProductByIdQuery = { __typename?: 'QueryRoot', product?: { __typename?: 'Product', id: string, title: string, handle: string, descriptionHtml: any, vendor: string, images: { __typename?: 'ImageConnection', nodes: Array<{ __typename?: 'Image', url: any, altText?: string | null }> }, options: Array<{ __typename?: 'ProductOption', name: string, values: Array<string> }>, variants: { __typename?: 'ProductVariantConnection', nodes: Array<{ __typename?: 'ProductVariant', id: string, title: string, availableForSale: boolean, selectedOptions: Array<{ __typename?: 'SelectedOption', name: string, value: string }>, price: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode } }> }, priceRange: { __typename?: 'ProductPriceRange', minVariantPrice: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode } } } | null };

export type ProductVariantFragment = { __typename?: 'ProductVariant', id: string, title: string, availableForSale: boolean, selectedOptions: Array<{ __typename?: 'SelectedOption', name: string, value: string }>, price: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode } };

export type GetCollectionProductsQueryVariables = Types.Exact<{
  handle: Types.Scalars['String']['input'];
  first: Types.Scalars['Int']['input'];
}>;


export type GetCollectionProductsQuery = { __typename?: 'QueryRoot', collection?: { __typename?: 'Collection', id: string, title: string, description: string, products: { __typename?: 'ProductConnection', nodes: Array<{ __typename?: 'Product', id: string, title: string, handle: string, featuredImage?: { __typename?: 'Image', url: any, altText?: string | null } | null, priceRange: { __typename?: 'ProductPriceRange', minVariantPrice: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode } } }> } } | null };

export type ProductOptionsSelectorItemFragment = { __typename?: 'ProductOption', name: string, values: Array<string> };

export const ProductVariantFragmentDoc = gql`
    fragment ProductVariant on ProductVariant {
  id
  title
  availableForSale
  selectedOptions {
    name
    value
  }
  price {
    amount
    currencyCode
  }
}
    `;
export const ProductOptionsSelectorItemFragmentDoc = gql`
    fragment ProductOptionsSelectorItem on ProductOption {
  name
  values
}
    `;
export const GetProductsDocument = gql`
    query GetProducts {
  products(first: 10) {
    nodes {
      id
      title
      handle
      featuredImage {
        url
        altText
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
}
    `;
export const GetProductByIdDocument = gql`
    query GetProductById($id: ID!) {
  product(id: $id) {
    id
    title
    handle
    descriptionHtml
    vendor
    images(first: 10) {
      nodes {
        url
        altText
      }
    }
    options {
      name
      values
    }
    variants(first: 100) {
      nodes {
        ...ProductVariant
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
}
    ${ProductVariantFragmentDoc}`;
export const GetCollectionProductsDocument = gql`
    query GetCollectionProducts($handle: String!, $first: Int!) {
  collection(handle: $handle) {
    id
    title
    description
    products(first: $first) {
      nodes {
        id
        title
        handle
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
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
    GetProducts(variables?: GetProductsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetProductsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetProductsQuery>({ document: GetProductsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetProducts', 'query', variables);
    },
    GetProductById(variables: GetProductByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetProductByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetProductByIdQuery>({ document: GetProductByIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetProductById', 'query', variables);
    },
    GetCollectionProducts(variables: GetCollectionProductsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetCollectionProductsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCollectionProductsQuery>({ document: GetCollectionProductsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetCollectionProducts', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;