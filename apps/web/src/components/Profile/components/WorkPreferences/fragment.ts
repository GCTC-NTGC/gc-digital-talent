import { graphql } from "@gc-digital-talent/graphql";

export const FlexibleWorkLocationOptions_Fragment = graphql(/* GraphQL */ `
  fragment FlexibleWorkLocationOptionsFragment on Query {
    flexibleWorkLocation: localizedEnumStrings(
      enumName: "FlexibleWorkLocation"
    ) {
      value
      label {
        en
        fr
        localized
      }
    }
  }
`);
