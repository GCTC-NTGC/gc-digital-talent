import { graphql } from "@gc-digital-talent/graphql";

export const TalentRequestSourceOptions_Fragment = graphql(/* GraphQL */ `
  fragment TalentRequestSourceOptionsFragment on Query {
    talentSource: localizedEnumOptions(enumName: "TalentRequestSource") {
      ... on LocalizedTalentRequestSource {
        value
        label {
          localized
        }
      }
    }
  }
`);
