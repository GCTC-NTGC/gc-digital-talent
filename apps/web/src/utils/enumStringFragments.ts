import { graphql } from "@gc-digital-talent/graphql";

// eslint-disable-next-line import/prefer-default-export
export const SkillCategoryStrings_Fragment = graphql(/* GraphQL */ `
  fragment SkillCategoryStrings on Query {
    skillCategories: localizedEnumStrings(enumName: "SkillCategory") {
      value
      label {
        en
        fr
      }
    }
  }
`);
