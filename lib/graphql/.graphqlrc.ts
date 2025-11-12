import {ApiType, pluckConfig, preset} from '@shopify/api-codegen-preset';

export default {
  // For syntax highlighting / auto-complete when writing operations
  schema: 'https://shopify.dev/storefront-graphql-direct-proxy/2025-01',
  documents: ['./**/*.ts'],
  projects: {
    default: {
      // For type extraction
      schema: 'https://shopify.dev/storefront-graphql-direct-proxy/2025-01',
      documents: ['./**/*.ts'],
      writeHooks: true,
      extensions: {
        codegen: {
          // Enables support for `#graphql` tags, as well as `/* GraphQL */`
          pluckConfig,
          generates: {
            './types/shopify.schema.json': {
              plugins: ['introspection'],
              config: {minify: true},
            },
            './types/shopify.types.d.ts': {
              plugins: ['typescript'],
            },
            './types/shopify.generated.d.ts': {
              preset,
              presetConfig: {
                apiType: ApiType.Storefront,
                writeHooks: true
              },
            },
          },
        },
      },
    },
  },
};