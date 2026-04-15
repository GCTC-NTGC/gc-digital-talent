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
    "./src/gql/": {
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
      },
    },
  },
};

export default config;
