import type {CodegenConfig} from '@graphql-codegen/cli';

import {getSchema, pluckConfig, preset} from '@shopify/hydrogen-codegen';

export default {
  generates: {
    './types/shopify/shopify.generated.d.ts': {
      documents: ['./app/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
      preset,
      presetConfig: {
        // the generated types to the GraphQL client:
        interfaceExtension: ({mutationType, queryType}: any) => `
          declare module 'my-api-client' {
            interface MyAPIQueries extends ${queryType} {}
            interface MyAPIMutations extends ${mutationType} {}
          }
        `,
        // Add a custom interface extension to connect
        // Skip the __typename property from generated types:
        skipTypenameInOperations: true,
      },
      schema: getSchema('storefront'),
    },
  },
  overwrite: true,
  pluckConfig,
} as CodegenConfig;
