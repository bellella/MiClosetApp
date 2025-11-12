import axios, { AxiosRequestConfig } from 'axios';

// Shopify Storefront API endpoint and token
const BASE_URL = 'https://miicloset.myshopify.com/api/2024-04/graphql';
const TOKEN = '051a89c6384586f7b96f243ec4515804';

// Axios instance
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Shopify-Storefront-Access-Token': TOKEN,
    'Content-Type': 'application/json',
  },
});

// Flatten Shopify connection structure (edges -> node[])
export function flattenConnection<T = any>(connection: {
  edges?: { node: T }[];
}): T[] {
  if (!connection?.edges) return [];
  return connection.edges.map((edge) => edge.node);
}

// Detect and flatten any top-level connection in a response object
function extractFlattened<T>(data: T): {
  original: T;
  flattened: Record<string, any>;
} {
  const flattened: Record<string, any> = {};

  for (const key in data) {
    const value = (data as any)[key];
    if (value && typeof value === 'object' && 'edges' in value) {
      flattened[key] = flattenConnection(value);
    }
  }

  return { original: data, flattened };
}

// Generic GET request (REST)
export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<{ original: T; flattened: Record<string, any> }> => {
  const res = await instance.get<T>(url, config);
  return extractFlattened(res.data);
};

// Generic POST request (REST)
export const post = async <T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<{ original: T; flattened: Record<string, any> }> => {
  const res = await instance.post<T>(url, data, config);
  return extractFlattened(res.data);
};

// GraphQL request (Shopify Storefront)
export const graphql = async <T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<{ original: T; flattened: Record<string, any> }> => {
  const res = await instance.post('', { query, variables });

  if (res.data.errors) {
    console.error('GraphQL Errors:', res.data.errors);
    throw new Error('Shopify GraphQL request failed');
  }

  return extractFlattened(res.data.data as T);
};
