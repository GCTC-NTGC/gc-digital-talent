import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../../api/storage/app/lighthouse-schema.graphql",
  documents: [
    "../auth/src/**/*.tsx",
    "../../apps/web/src/**/*.tsx",
    "../../apps/web/src/**/*.ts",
  ],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
      config: {
        scalars: {
          Date: "string",
          DateTime: "string",
          Email: "string",
          PhoneNumber: "string",
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
