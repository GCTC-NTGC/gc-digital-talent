import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../../api/storage/app/lighthouse-schema.graphql",
  documents: [
    "../**/*.tsx",
    "../../apps/**/src/**/*.tsx",
    "../../apps/**/src/**/*.ts",
    "../../apps/**/cypress/**/*.ts",
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
        },
      },
      presetConfig: {
        fragmentMasking: {
          unmaskFunctionName: "getFragment",
        },
      },
    },
  },
  hooks: { afterAllFileWrite: ["prettier --write"] },
};

export default config;
