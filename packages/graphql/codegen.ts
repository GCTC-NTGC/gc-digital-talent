import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../../api/storage/app/lighthouse-schema.graphql",
  documents: ["../../apps/**/src/**/*.tsx", "../**/*.tsx"],
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
