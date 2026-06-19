import { graphql } from "@gc-digital-talent/graphql";

export const TalentRequestUserSkillMatch_Fragment = graphql(/* GraphQL */ `
  fragment TalentRequestUserSkillMatch on Skill {
    id
    key
    name {
      en
      fr
    }
    keywords {
      en
      fr
    }
    description {
      en
      fr
    }
    category {
      value
      label {
        en
        fr
      }
    }
    families {
      id
      key
      name {
        en
        fr
      }
      description {
        en
        fr
      }
    }
  }
`);
