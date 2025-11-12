import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://miicloset.myshopify.com/api/2024-04/graphql',
    headers: {
      'X-Shopify-Storefront-Access-Token': '051a89c6384586f7b96f243ec4515804',
      'Content-Type': 'application/json',
    },
  }),
  cache: new InMemoryCache(),
});

export default client;