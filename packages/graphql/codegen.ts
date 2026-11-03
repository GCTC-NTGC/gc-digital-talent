import { type CodegenConfig } from "@graphql-codegen/cli";

const scalars = {
  ID: "string",
  Date: "string",
  DateTime: "string",
  Email: "string",
  PhoneNumber: "string",
  KeyString: "string",
  UUID: "string",
  BigInt: "number",
};

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
  generates: {
    "./src/gql/": {
      preset: "client",
      config: {
        scalars,
        enumType: "native",
        nonOptionalTypename: true,
      },
      presetConfig: {
        fragmentMasking: {
          unmaskFunctionName: "getFragment",
        },
      },
    },
    // Schema types for code outside of a GraphQL query, where a fragment can't
    // be used. Re-export the ones you need from src/index.ts.
    "./src/gql/schema-types.ts": {
      plugins: ["typescript"],
      config: {
        scalars,
        nonOptionalTypename: true,
      },
    },
  },
};

export default config;
