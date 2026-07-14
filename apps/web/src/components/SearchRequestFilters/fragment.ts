import { graphql } from "@gc-digital-talent/graphql";

export const TalentRequestSourceOptions_Fragment = graphql(/* GraphQL */ `
  fragment TalentRequestSourceOptionsFragment on Query {
    talentSource: localizedEnumStrings(enumName: "TalentRequestSource") {
      value
      label {
        en
        fr
        localized
      }
    }
  }
`);
