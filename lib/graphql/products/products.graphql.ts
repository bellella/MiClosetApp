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

export type GetCollectionProductsByHandleQueryVariables = Types.Exact<{
  handle: Types.Scalars['String']['input'];
  first: Types.Scalars['Int']['input'];
}>;


export type GetCollectionProductsByHandleQuery = { __typename?: 'QueryRoot', collection?: { __typename?: 'Collection', id: string, title: string, description: string, products: { __typename?: 'ProductConnection', nodes: Array<{ __typename?: 'Product', id: string, title: string, handle: string, featuredImage?: { __typename?: 'Image', url: any, altText?: string | null } | null, priceRange: { __typename?: 'ProductPriceRange', minVariantPrice: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode } } }> } } | null };

export type GetCollectionProductsByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type GetCollectionProductsByIdQuery = { __typename?: 'QueryRoot', collection?: { __typename?: 'Collection', id: string, title: string, products: { __typename?: 'ProductConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null }, nodes: Array<{ __typename?: 'Product', id: string, title: string, handle: string, featuredImage?: { __typename?: 'Image', url: any, altText?: string | null } | null, priceRange: { __typename?: 'ProductPriceRange', minVariantPrice: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode } } }> } } | null };

export type GetProductsByIdsQueryVariables = Types.Exact<{
  ids: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type GetProductsByIdsQuery = { __typename?: 'QueryRoot', nodes: Array<
    | { __typename?: 'AppliedGiftCard' }
    | { __typename?: 'Article' }
    | { __typename?: 'Blog' }
    | { __typename?: 'Cart' }
    | { __typename?: 'CartLine' }
    | { __typename?: 'Collection' }
    | { __typename?: 'Comment' }
    | { __typename?: 'Company' }
    | { __typename?: 'CompanyContact' }
    | { __typename?: 'CompanyLocation' }
    | { __typename?: 'ComponentizableCartLine' }
    | { __typename?: 'ExternalVideo' }
    | { __typename?: 'GenericFile' }
    | { __typename?: 'Location' }
    | { __typename?: 'MailingAddress' }
    | { __typename?: 'Market' }
    | { __typename?: 'MediaImage' }
    | { __typename?: 'MediaPresentation' }
    | { __typename?: 'Menu' }
    | { __typename?: 'MenuItem' }
    | { __typename?: 'Metafield' }
    | { __typename?: 'Metaobject' }
    | { __typename?: 'Model3d' }
    | { __typename?: 'Order' }
    | { __typename?: 'Page' }
    | { __typename?: 'Product', id: string, title: string, handle: string, availableForSale: boolean, featuredImage?: { __typename?: 'Image', url: any, altText?: string | null } | null, priceRange: { __typename?: 'ProductPriceRange', minVariantPrice: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode } } }
    | { __typename?: 'ProductOption' }
    | { __typename?: 'ProductOptionValue' }
    | { __typename?: 'ProductVariant' }
    | { __typename?: 'Shop' }
    | { __typename?: 'ShopPayInstallmentsFinancingPlan' }
    | { __typename?: 'ShopPayInstallmentsFinancingPlanTerm' }
    | { __typename?: 'ShopPayInstallmentsProductVariantPricing' }
    | { __typename?: 'ShopPolicy' }
    | { __typename?: 'TaxonomyCategory' }
    | { __typename?: 'UrlRedirect' }
    | { __typename?: 'Video' }
   | null> };

export type ProductCardFragment = { __typename?: 'Product', id: string, title: string, handle: string, availableForSale: boolean, featuredImage?: { __typename?: 'Image', url: any, altText?: string | null } | null, priceRange: { __typename?: 'ProductPriceRange', minVariantPrice: { __typename?: 'MoneyV2', amount: any, currencyCode: Types.CurrencyCode } } };

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
export const ProductCardFragmentDoc = gql`
    fragment ProductCard on Product {
  id
  title
  handle
  availableForSale
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
export const GetCollectionProductsByHandleDocument = gql`
    query GetCollectionProductsByHandle($handle: String!, $first: Int!) {
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
export const GetCollectionProductsByIdDocument = gql`
    query GetCollectionProductsById($id: ID!, $first: Int = 20, $after: String) {
  collection(id: $id) {
    id
    title
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
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
export const GetProductsByIdsDocument = gql`
    query getProductsByIds($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Product {
      ...ProductCard
    }
  }
}
    ${ProductCardFragmentDoc}`;

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
    GetCollectionProductsByHandle(variables: GetCollectionProductsByHandleQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetCollectionProductsByHandleQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCollectionProductsByHandleQuery>({ document: GetCollectionProductsByHandleDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetCollectionProductsByHandle', 'query', variables);
    },
    GetCollectionProductsById(variables: GetCollectionProductsByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetCollectionProductsByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCollectionProductsByIdQuery>({ document: GetCollectionProductsByIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetCollectionProductsById', 'query', variables);
    },
    getProductsByIds(variables: GetProductsByIdsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetProductsByIdsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetProductsByIdsQuery>({ document: GetProductsByIdsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'getProductsByIds', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;