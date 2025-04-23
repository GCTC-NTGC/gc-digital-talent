import { graphql } from "@gc-digital-talent/graphql";

export const BasicInformationOptions_Fragment = graphql(/* GraphQL */ `
  fragment BasicInformationOptions on Query {
    ...WorkPreferencesOptions
  }
`);
