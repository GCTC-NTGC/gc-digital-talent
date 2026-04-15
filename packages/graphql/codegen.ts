import { type CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../../api/storage/app/lighthouse-schema.graphql",
  documents: [
    "../auth/src/**/*.tsx",
    "../../apps/web/src/**/*.tsx",
    "../../apps/web/src/**/*.ts",
  ],
  ignoreNoDocuments: true,
  config: {
    useTypeImports: true,
  },
  // Watch mode configuration to reduce HMR refresh spam
  // Debounce waits for file changes to settle before regenerating
  watchConfig: {
    debounce: 500,
  },
  generates: {
    // Output to a single file to prevent multiple HMR refreshes
    // When using directory output, each file (gql.ts, graphql.ts, fragment-masking.ts)
    // triggers a separate HMR update causing 3+ page refreshes per change
    "./src/gql/index.ts": {
      preset: "client",
      config: {
        scalars: {
          Date: "string",
          DateTime: "string",
          Email: "string",
          PhoneNumber: "string",
          KeyString: "string",
          UUID: "string",
        },
      },
      presetConfig: {
        fragmentMasking: {
          unmaskFunctionName: "getFragment",
        },
        // Generate all code in a single file instead of multiple files
        emitLegacySingleFile: true,
      },
    },
  },
};

export default config;
